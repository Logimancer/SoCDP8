-- Part of SoCDP8, Copyright by Folke Will, 2019
-- Licensed under CERN Open Hardware Licence v1.2
-- See HW_LICENSE for details
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

use work.socdp8_package.all;

entity pdp8 is
    generic (
        clk_frq: natural
    );
    port (
        clk: in std_logic;
        rst: in std_logic;
        
        -- Console connection
        leds: out pdp8i_leds;
        switches: in pdp8i_switches;
        
        -- I/O connections
        io_in: in pdp8i_io_in;
        io_out: out pdp8i_io_out;
        
        -- Interrupt request
        int_rqst: in std_logic;

        -- to be connected to RAM
        ext_mem_in: in ext_mem_in;
        ext_mem_out: out ext_mem_out
    );
end pdp8;

architecture Behavioral of pdp8 is
    -- Drawing D-BS-8I-0-2, region M900.D40 (B1):
    -- The run FF is evaluated at every TP3 pulse, i.e. in TS4.
    -- It is used to decide whether to generate a memory transfer which will
    -- result in continuous computer cycles. Its transitions depend mainly on
    -- external switches and the HLT instruction.
    signal run: std_logic;

    -- Drawing D-BS-8I-0-2, region M617.F30 (B5):
    -- This region generates the MANUAL PRESET signal which is used to clear some FFs throughout the system,
    -- for example the major state FFs. The signal is generated if the CONT switch is not active (!) at
    -- MFTP0, i.e. it is active if LA, ST, EX or DP are pressed. This matches drawing D-FD-8I-0-1 where this
    -- transfer is called 0 -> MAJOR STATES.
    signal manual_preset: std_logic;
    
    -- Drawing D-BS-8I-0-2, region M113.E15 (C8):
    -- This region generates the MEM START signal if the LOAD key is not active (!) at MFTP2, i.e. MEM START
    -- is generated if ST, EX, DP or CONT are pressed. This matches drawing D-FD-8I-0-1.
    -- The signal is also generated if run is high while pause is low and mem idle is high, shown in the same drawing.
    signal mem_start: std_logic;
    
    -- The cont switch forces a manual TP4 pulse to finish the TS4 state in manual mode.
    -- This is shown in drawing D-BS-8I-0-2, region M113.E15 (C7)
    signal force_tp4: std_logic;
    
    -- Combinatorial signal to decide whether auto-indexing is active in the current cycle
    signal auto_index: std_logic;
    
    -- TS3 can be paused due to I/O or EAE
    signal pause: std_logic;
    
    --- current major state
    signal state: major_state;

    -- current instruction
    signal inst: pdp8_instruction;
    signal eae_inst: eae_instruction;

    -- EAE: currently normalized
    signal norm: std_logic;

    -- interconnect wires
    --- from manual timing generator
    signal mft: time_state_manual;
    signal mftp: std_logic;
    signal mfts0: std_logic;
    --- from automatic timing generator
    signal ts: time_state_auto;
    signal tp: std_logic;
    signal mem_idle: std_logic;
    signal io_start: std_logic;
    signal io_state: io_state;
    signal io_end: std_logic;
    signal io_strobe: std_logic;
    signal int_strobe: std_logic;
    signal eae_start: std_logic;
    signal eae_end: std_logic;
    signal eae_on: std_logic;
    signal eae_tg: std_logic;
    --- from memory
    signal strobe: std_logic;
    signal sense: std_logic_vector(11 downto 0);
    signal mem_done: std_logic;
    --- from register network
    signal reg_trans: register_transfers;
    signal link: std_logic;
    signal skip: std_logic;
    signal pc, ma, mb, ac, mem, mqr: std_logic_vector(11 downto 0);
    signal sc: std_logic_vector(4 downto 0);
    signal inst_cur: pdp8_instruction;
    signal eae_inst_cur: eae_instruction;
    --- from instruction mux
    signal reg_trans_inst: register_transfers;
    signal next_state_inst: major_state;
    --- from interrupt controller
    signal int_ok: std_logic;
    signal int_enable: std_logic;
begin

manual_timing_inst: entity work.timing_manual
generic map (
    clk_frq => clk_frq
)
port map (
    clk => clk,
    rst => rst,
    run => run,
    
    key_load => switches.load,
    key_start => switches.start,
    key_ex => switches.exam,
    key_dep => switches.dep,
    key_cont => switches.cont,
    
    mfts0 => mfts0,
    mftp => mftp,
    mft => mft
);

computer_timing_inst: entity work.timing_auto
generic map (
    clk_frq => clk_frq
)
port map (
    clk => clk,
    rst => rst,
  
    strobe => strobe,
    mem_done => mem_done,
    manual_preset => manual_preset,
    run => run,
    pause => pause,
    force_tp4 => force_tp4,
    
    ts => ts,
    tp => tp,
    mem_idle_o => mem_idle,
    
    int_strobe => int_strobe,
    
    io_start => io_start,
    io_state_o => io_state,
    io_end => io_end,
    io_strobe => io_strobe,
    
    eae_start => eae_start,
    eae_on => eae_on,
    eae_tg => eae_tg,
    eae_end => eae_end
);

regs: entity work.registers
port map (
    clk => clk,
    rst => rst,
    
    sr => switches.swr,
    sense => sense,
    io_bus => io_in.bus_in,

    transfers => reg_trans,

    pc_o => pc,
    ma_o => ma,
    mb_o => mb,
    ac_o => ac,
    mqr_o => mqr,
    sc_o => sc,
    link_o => link,
    inst_o => inst_cur,
    skip_o => skip,
    eae_inst_o => eae_inst_cur
);

mem_control: entity work.memory_control
generic map (
    clk_frq => clk_frq
)
port map (
    clk => clk,
    rst => rst,
    mem_addr => ma,
    field => "000",
    mem_start => mem_start,
    mem_done => mem_done,
    strobe => strobe,
    sense => sense,
    mem_buf => mb,
    ext_mem_in => ext_mem_in,
    ext_mem_out => ext_mem_out
);

inst_mux: entity work.instruction_multiplexer
port map (
    inst => inst,
    input => (
            state => state,
            time_div => ts,
            mb => mb,
            mqr => mqr,
            sc => sc,
            link => link,
            auto_index => auto_index,
            skip => skip,
            brk_req => '0',     -- TODO
            norm => norm,
            eae_inst => eae_inst
        ),
    eae_on => eae_on,
    eae_inst => eae_inst,
    transfers => reg_trans_inst,
    state_next => next_state_inst
);

interrupt_instance: entity work.interrupt_controller
port map (
    clk => clk,
    rst => rst,

    int_rqst => int_rqst,
    int_strobe => int_strobe,

    manual_preset => manual_preset,
    
    int_enable => int_enable,
    int_ok => int_ok,

    ts => ts,
    tp => tp,
    run => run,
    switches => switches,
    state => state,
    mb => mb,
    inst => inst,
    state_next => next_state_inst
);

auto_index <= '1' when state = STATE_DEFER and ma(11 downto 3) = "000000001" else '0';
norm <= '1' when (ac(11) /= ac(10)) or (mqr = o"0000" and ac(9 downto 0) = "0000000000") else '0';

time_state_pulses: process
begin
    wait until rising_edge(clk);
    
    -- reset pulse signals
    --- internal
    manual_preset <= '0';

    --- memory
    mem_start <= '0';
    
    -- timing
    force_tp4 <= '0';
    io_start <= '0';
    eae_start <= '0';
    eae_end <= '0';

    --- registers
    reg_trans <= nop_transfer;

    -- The timing works like this:
    -- At startup, the manual timing is in no state and the auto timinig is in TS1.
    -- However, no pulses are generated so nothing happens automatically.
    --
    -- To generate the first pulse, one of the keys START, LOAD, DEP, EX or CONT has to be pressed.
    -- Pressing a switch will go through the cycles MFT0 - MFT1 - MFT2 in that order.
    -- If the switch started a memory transfer (all except LOAD), then TS2 - TS3 - TS4 - TS1 are
    -- executed due to the memory transaction. The major state will be STATE_NONE in this full cycle
    -- for all keys except CONT.
    --
    -- However, if the run FF is cleared in TS3, then TS4 is entered but TP4 will be delayed until
    -- manually forced through the CONT key in MFT2. This means that that the last transfer of
    -- the instruction will be delayed. 
    --
    -- If the run FF is set in TS3 (which is prevented by switches SING STEP, EX, DEP and by
    -- SING INST and STOP if the next major would be FETCH), then continouos memory cycles are
    -- generated and the system will run TS2 - TS3 - TS4 - TS1 until run is cleared.
    --
    -- Since the manual pulses are not generated while run is set, the system has to be stopped
    -- in TS3 by SING STEP, SING INST or STOP. EX and DEP cannot be used because they only clear
    -- the run FF if the switches were pressed while run was initially clear (indicated by MFTS0).

    -- To implement this, the system needs to keep track of two states simultaneously.

    if manual_preset = '1' then
        state <= STATE_NONE;
    end if;
    
    if strobe = '1' then
        pause <= '0';
    end if;

    case ts is
        -- the TS transfers are described in drawing D-FD-8I-0-1 (Auto Functions)
        when TS1 =>
            -- start a new memory cycle so we eventually get the pulse
            if run = '1' and pause = '0' and mem_idle = '1' then
                mem_start <= '1';
            end if;
            
            if tp = '1' then
                reg_trans <= reg_trans_inst;
            end if;
        when TS2 =>
            if tp = '1' then
                if state /= STATE_NONE then
                    if state = STATE_FETCH then
                        inst <= inst_cur;
                    end if;
                    
                    reg_trans <= reg_trans_inst;
                else
                    if mft = MFT3 and switches.dep = '1' then
                        -- SR -> MB
                        reg_trans.sr_enable <= '1';
                        reg_trans.mb_load <= '1';
                    else
                        -- default for switches: restore memory that was read
                        -- MEM -> MB
                        reg_trans.mem_enable <= '1';
                        reg_trans.mb_load <= '1';
                    end if;
                end if;
            end if;
        when TS3 =>
            if tp = '1' then
                reg_trans <= reg_trans_inst;
                if reg_trans_inst.load_eae_inst = '1' then
                    eae_inst <= eae_inst_cur;
                end if;
    
                -- run is enabled by default...
                run <= '1';
                
                -- ...unless
                --- a) the SING STEP switch always pauses run
                if switches.sing_step then
                    run <= '0';
                end if;
                
                --- b) the DEP and EXAM switches also keep run disabled for further EXAMs or DEPs
                if mfts0 and (switches.exam or switches.dep) then
                    run <= '0';
                end if;
                
                --- c) the STOP and SING INST switches disable run but only if the next cycle would be fetch
                if (next_state_inst = STATE_FETCH or state = STATE_NONE) and (switches.sing_inst = '1' or switches.stop = '1') then
                    run <= '0';
                end if;
                
                --- d) the HLT instruction
                if reg_trans_inst.clear_run = '1' then
                    run <= '0';
                end if;
                
                -- slow cycle unless internal address
                if state = STATE_FETCH and inst = INST_IOT then
                    -- this is basically the IO START signal
                    pause <= '1';
                    io_start <= '1';
                end if;
                
                if reg_trans_inst.eae_set = '1' then
                    pause <= '1';
                    eae_start <= '1';
                end if;
            end if;
            
            -- I/O happens in TS3 and uses io_strobe instead of tp to activate transfers
            if io_strobe = '1' and (io_out.iop /= "000") then
                -- We will always read the bus into AC.
                -- Therefore, if ac_clear is not desired, we enable
                -- AC to OR the bus with AC. Otherwise, when clear
                -- is desired, we won't load AC and thus overwrite it.
                if io_in.ac_clear = '0' then
                    reg_trans.ac_enable <= '1';
                end if;
                reg_trans.bus_enable <= '1';
                reg_trans.ac_load <= '1';
                
                -- Enabling reverse-skip transfers 1 -> SKIP.
                reg_trans.reverse_skip <= io_in.io_skip;
                reg_trans.skip_load <= '1';
            end if;
            
            if io_end = '1' then
                pause <= '0';
            end if;
            
            -- EAE instructions are also executed in TS3, clocked by eae_tg
            if eae_on = '1' and eae_tg = '1' then
                if reg_trans_inst.eae_end = '1' then
                    eae_end <= '1';
                    pause <= '0';
                end if;
                reg_trans <= reg_trans_inst;
            end if;
        when TS4 =>
            -- If run was set to 0 in TS3, this pulse will not happen until CONT is pressed.
            -- Pressing START will go to TS1 without this pulse! 
            if tp = '1' then
                if state /= STATE_NONE then
                    reg_trans <= reg_trans_inst;
                    state <= next_state_inst;
                else
                    state <= STATE_FETCH;
                end if;

                if int_ok = '1' then
                    -- 0 -> MA
                    reg_trans <= nop_transfer;
                    reg_trans.ma_load <= '1';
                    inst <= INST_JMS;
                    state <= STATE_EXEC;
                end if;
            end if;
    end case;

    case mft is
        when MFT0 =>
            if mftp = '1' then
                if switches.start = '1' then
                    reg_trans.initialize <= '1';
                end if;
                
                -- Originally, condition is switches.cont = '0' but this is more readable
                if switches.start or switches.exam or switches.dep or switches.load then
                    manual_preset <= '1';
                end if;
            end if;
        -- the MFT transfers are described in drawing D-FD-8I-0-1 (Manual Functions)
        when MFT1 =>
            if mftp = '1' then
                if switches.exam or switches.dep or switches.start then
                    -- PC -> MA
                    reg_trans.pc_enable <= '1';
                    reg_trans.ma_load <= '1';
                end if;
            end if;
        when MFT2 =>
            if mftp = '1' then
                if switches.load = '1' then
                    -- SR -> PC
                    reg_trans.sr_enable <= '1';
                    reg_trans.pc_load <= '1';
                end if;
                
                if switches.start = '1' then
                    state <= STATE_FETCH;
                end if;
                
                if switches.exam = '1' or switches.dep = '1' then
                    -- MA + 1 -> PC
                    reg_trans.ma_enable <= '1';
                    reg_trans.carry_insert <= '1';
                    reg_trans.pc_load <= '1';
                end if;
            
                -- Start a memory cycle if any of the following switches is pressed
                -- Originally, the condition is switches.load = '0' but this is more readable:
                if switches.start or switches.exam or switches.dep or switches.cont then
                    mem_start <= '1';
                end if;
    
                if switches.cont = '1' then
                    force_tp4 <= '1';
                end if;
            end if;
        when MFT3 =>
            null;
    end case;

    if rst = '1' then
        state <= STATE_NONE;
        inst <= INST_AND; -- all zero = AND
        eae_inst <= EAE_NONE;
        run <= '0';
        pause <= '0';
    end if;
end process;

io_out.iop(0) <= '1' when io_state = IO1 and mb(0) = '1' else '0';
io_out.iop(1) <= '1' when io_state = IO2 and mb(1) = '1' else '0';
io_out.iop(2) <= '1' when io_state = IO4 and mb(2) = '1' else '0';
io_out.ac <= ac;
io_out.mb <= mb;

leds.pc <= pc;
leds.mem_addr <= ma;
leds.mem_buf <= mb;
leds.link <= link;
leds.accu <= ac;

leds.mqr <= mqr;
leds.step_counter <= sc;

leds.state <= state;
leds.instruction <= inst;
leds.ion <= int_enable;
leds.run <= run;
leds.pause <= pause;

end Behavioral;
