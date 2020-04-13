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

import { MachineState, DeviceID } from '../../models/MachineState';

import React from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Slider, { Mark } from '@material-ui/core/Slider';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export interface MachineFormProps {
    initialState: MachineState;
    onSubmit(state: MachineState): void;
}

const useStyles = makeStyles(theme => createStyles({
    fieldset: {
        paddingTop: 15,
        marginBottom: 20,
    }
}));

export const MachineForm: React.FunctionComponent<MachineFormProps> = (props) => {
    const classes = useStyles();

    const coreMemoryMarks: Mark[] = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {return {
            value: i,
            label: `${(i + 1) * 4} kiW`
        } as Mark}
    );

    const pt08Marks: Mark[] = [0, 1, 2, 3, 4].map(i => {return {
            value: i,
            label: `${i}`
        } as Mark}
    );

    const s = props.initialState;

    return (
        <form autoComplete='off' onSubmit={(ev) => props.onSubmit(toMachineState(ev))}>
            <FormGroup>
                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Machine Name</FormLabel>
                    <TextField required name='name' label='Name' variant='outlined' defaultValue={s.name} />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>CPU Extensions</FormLabel>
                    <FormControlLabel control={<Switch name='eae' color='primary' defaultChecked={s.eaePresent} />} label='KE8/I (EAE)' />
                    <FormControlLabel control={<Switch name='kt8i' color='primary' defaultChecked={s.kt8iPresent} />} label='KT8/I (Time Sharing Option)' />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Core Memory</FormLabel>
                    <Slider
                        defaultValue={s.maxMemField}
                        valueLabelDisplay='off'
                        step={1}
                        min={0}
                        max={7}
                        marks={coreMemoryMarks}
                        name='maxMemField'
                    />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Basic I/O</FormLabel>
                    <FormControlLabel control={
                        <Switch name='asr33' color='primary' defaultChecked={s.peripherals.includes(DeviceID.DEV_ID_ASR33) } />
                    } label='ASR-33 Teletype' />
                    <FormControlLabel control={
                        <Switch name='pc04' color='primary' defaultChecked={s.peripherals.includes(DeviceID.DEV_ID_PC04)} />
                    } label='PC04 Reader / Punch' />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>DECtape</FormLabel>
                    <FormControlLabel control={
                        <Switch name='tc08' color='primary' defaultChecked={s.peripherals.includes(DeviceID.DEV_ID_TC08)} />
                    } label='TC08 DECtape Controller' />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Hard Disk</FormLabel>
                    <RadioGroup name='disk' defaultValue={DeviceID[getDiskType(s.peripherals)]}>
                        <FormControlLabel value={DeviceID[DeviceID.DEV_ID_NULL]} control={<Radio />} label='None' />
                        <FormControlLabel value={DeviceID[DeviceID.DEV_ID_DF32]} control={<Radio />} label='DF32' />
                        <FormControlLabel value={DeviceID[DeviceID.DEV_ID_RF08]} control={<Radio />} label='RF08' />
                        <FormControlLabel value={DeviceID[DeviceID.DEV_ID_RK8]} control={<Radio />} label='RK8' />
                    </RadioGroup>
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Additional PT08 Serial Ports</FormLabel>
                    <Slider
                        defaultValue={countPT08(s.peripherals)}
                        valueLabelDisplay='off'
                        step={1}
                        min={0}
                        max={4}
                        marks={pt08Marks}
                        name='pt08'
                    />
                </FormControl>

                <FormControl component='fieldset' className={classes.fieldset}>
                    <FormLabel component='legend'>Real-Time Clock</FormLabel>
                    <FormControlLabel control={
                        <Switch name='kw8i' color='primary'defaultChecked={s.peripherals.includes(DeviceID.DEV_ID_KW8I)} />
                    } label='KW8/I' />
                </FormControl>
            </FormGroup>
            <Button type='submit' variant='contained' color='primary'>
                Create Machine
            </Button>
        </form>
    );
}

function toMachineState(ev: React.FormEvent<HTMLFormElement>): MachineState {
    const form = ev.currentTarget;
    const s = new MachineState();

    s.name = (form.elements.namedItem('name') as HTMLInputElement).value;

    s.eaePresent = (form.elements.namedItem('eae') as HTMLInputElement).checked;
    s.kt8iPresent = (form.elements.namedItem('kt8i') as HTMLInputElement).checked;
    s.maxMemField = Number.parseInt((form.elements.namedItem('maxMemField') as HTMLInputElement).value);

    if ((form.elements.namedItem('asr33') as HTMLInputElement).checked) {
        s.peripherals.push(DeviceID.DEV_ID_ASR33);
    }

    if ((form.elements.namedItem('pc04') as HTMLInputElement).checked) {
        s.peripherals.push(DeviceID.DEV_ID_PC04);
    }

    if ((form.elements.namedItem('kw8i') as HTMLInputElement).checked) {
        s.peripherals.push(DeviceID.DEV_ID_KW8I);
    }

    if ((form.elements.namedItem('tc08') as HTMLInputElement).checked) {
        s.peripherals.push(DeviceID.DEV_ID_TC08);
    }

    switch (Number.parseInt((form.elements.namedItem('pt08') as HTMLInputElement).value)) {
        case 4:
            s.peripherals.push(DeviceID.DEV_ID_TT4);
        case 3:
            s.peripherals.push(DeviceID.DEV_ID_TT3);
        case 2:
            s.peripherals.push(DeviceID.DEV_ID_TT2);
        case 1:
            s.peripherals.push(DeviceID.DEV_ID_TT1);
    }

    const diskStr = (form.elements.namedItem('disk') as HTMLInputElement).value;
    const diskId = DeviceID[diskStr as keyof typeof DeviceID];
    if (diskId != DeviceID.DEV_ID_NULL) {
        s.peripherals.push(diskId);
    }

    ev.preventDefault();
    return s;
}

function countPT08(list: DeviceID[]): number {
    let count = 0;

    for (const id of list) {
        if (id >= DeviceID.DEV_ID_TT1 && id <= DeviceID.DEV_ID_TT4) {
            count++;
        }
    }

    return count;
}

function getDiskType(list: DeviceID[]): DeviceID {
    for (const id of list) {
        switch (id) {
            case DeviceID.DEV_ID_DF32: return id;
            case DeviceID.DEV_ID_RF08: return id;
            case DeviceID.DEV_ID_RK8: return id;
        }
    }
    return DeviceID.DEV_ID_NULL;
}
