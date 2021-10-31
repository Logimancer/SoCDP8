/*
 *   SoCDP8 - A PDP-8/I implementation on a SoC
 *   Copyright (C) 2019 Folke Will <folko@solhost.org>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { PT08Configuration, BaudRate, BAUD_RATES } from '../../types/PeripheralTypes';
import { PaperTape } from '../../models/PaperTape';
import { Terminal } from 'xterm';
import { PaperTapeBox } from './PaperTapeBox';
import { downloadData } from '../../util';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { createStyles, makeStyles } from "@material-ui/core/styles";

import '../../../node_modules/xterm/css/xterm.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Select, Switch, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface PT08Props {
    conf: PT08Configuration;
    onConfigChange(conf: PT08Configuration): void;

    terminal: Terminal;

    readerTape?: PaperTape;
    readerActive: boolean;
    onReaderActivationChange(state: boolean): void;
    onReaderTapeLoad(tape: File): void;

    punchTape: PaperTape;
    punchActive: boolean;
    onPunchActivationChange(state: boolean): void;
    onPunchClear(): void;
    onPunchLeader(): void;
}

const useStyles = makeStyles(theme => createStyles({
    fileInput: {
        display: 'none',
    }
}));

export function PT08(props: PT08Props) {
    return (
        <section>
            <ConfigBox {...props} />

            <TerminalBox {...props} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='body1'>Reader &amp; Punch</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Container>
                        <ReaderBox {...props} />
                        <Divider />
                        <PunchBox {...props} />
                    </Container>
                </AccordionDetails>
            </Accordion>
        </section>
    );
}

const ConfigBox: React.FunctionComponent<PT08Props> = observer(props =>
    <Box>
        <FormGroup row>
            <FormControl>
                <FormLabel component="legend">Baud Rate</FormLabel>
                <Select
                    value={props.conf.baudRate}
                    onChange={(evt) => {
                        const rate = Number.parseInt(evt.target.value as string) as BaudRate;
                        props.onConfigChange({...props.conf, baudRate: rate});
                    }}
                >
                    {BAUD_RATES.map((b) => (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Switch
                        checked={props.conf.eightBit}
                        onChange={(evt) => {
                            const bit8 = evt.target.checked;
                            props.onConfigChange({...props.conf, eightBit: bit8});
                        }}
                    />
                }
                labelPlacement="start"
                label="Set 8th bit"
            />
        </FormGroup>
    </Box>
);

function TerminalBox(props: PT08Props) {
    const termRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!termRef.current) {
            return;
        }
        const term = props.terminal;
        term.setOption('bellStyle', 'both');
        term.resize(80, 25);
        term.open(termRef.current);
    }, [props.terminal]);

    return (
        <React.Fragment>
            <Box mt={1}>
                <div ref={termRef}></div>
            </Box>

            <Box mt={1} mb={3}>
                <Button variant="contained" onClick={() => props.terminal.reset()}>
                    Clear Output
                </Button>
            </Box>
        </React.Fragment>
    );
};

const ReaderBox: React.FunctionComponent<PT08Props> = observer(props => {
    const classes = useStyles();
    const tapeInput = React.useRef<HTMLInputElement>(null);

    return (
        <Box mt={2}>
            <Typography component='h6' variant='h6'>Reader</Typography>

            <PaperTapeBox tape={props.readerTape} reverse={false} />

            <FormGroup row>
                <FormControl>
                    <input ref={tapeInput} className={classes.fileInput} type='file' onChange={evt => onLoadFile(evt, props)} />
                    <Button variant='outlined' color='primary' onClick={() => tapeInput?.current?.click()}>Load Tape</Button>
                </FormControl>
                <FormControlLabel
                    control={<Switch onChange={evt => props.onReaderActivationChange(evt.target.checked)} checked={props.readerActive} />}
                    labelPlacement='start'
                    label='Reader On'
                />
            </FormGroup>
        </Box>
    );
});

function onLoadFile(evt: React.ChangeEvent, props: PT08Props): void {
    const target = evt.target as HTMLInputElement;
    if (!target.files || target.files.length < 1) {
        return;
    }

    props.onReaderTapeLoad(target.files[0]);
}

const PunchBox: React.FunctionComponent<PT08Props> = observer(props =>
    <Box mt={2}>
        <Typography component='h6' variant='h6'>Punch</Typography>

        <PaperTapeBox tape={props.punchTape} reverse={true} />

        <FormGroup row>
            <FormControl>
                <Button variant='outlined' color='primary' onClick={() => props.onPunchClear()}>New Tape</Button>
            </FormControl>
            <FormControl>
                <Button variant='outlined' color='primary' onClick={() => downloadData(Uint8Array.from(props.punchTape.buffer), 'punch.bin')}>Download Tape</Button>
            </FormControl>
            <FormControl>
                <Button variant='outlined' color='primary' onClick={() => props.onPunchLeader()}>Leader</Button>
            </FormControl>
            <FormControlLabel
                control={<Switch onChange={evt => props.onPunchActivationChange(evt.target.checked)} checked={props.punchActive} />}
                labelPlacement='start'
                label='Punch On'
            />
        </FormGroup>
    </Box>
);
