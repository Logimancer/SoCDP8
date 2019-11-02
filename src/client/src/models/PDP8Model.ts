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

import * as io from 'socket.io-client'
import { FrontPanelState, FrontPanelDefaultState } from './FrontPanelState';
import { observable, action, computed } from 'mobx'

export class PDP8Model {
    private socket: SocketIOClient.Socket;

    @observable
    private frontPanel: FrontPanelState = FrontPanelDefaultState;

    @observable
    private punchData: string = '';

    constructor() {
        this.socket = io.connect('http://192.168.178.65:8000');

        this.socket.on('console-state', (state: FrontPanelState) => {
            this.onFrontPanelChange(state);
        });

        this.socket.on('peripheral-event', (data: any) => {
            const devId = data.devId as number;
            const action = data.action as string;
            this.onPeripheralEvent(devId, action, data);
        });
    }

    @action
    private onFrontPanelChange(newState: FrontPanelState): void {
        this.frontPanel = newState;
    }

    private onPeripheralEvent(devId: number, action: string, data: any) {
        if (devId == 1) {
            if (action == 'punch') {
                this.onASR33Punch(data.data);
            }
        }
    }

    @action
    private onASR33Punch(data: number): void {
        const chr = data & 0x7F;
        const old = this.punchData;
        if (chr == 0x7F) {
            // Rub-out
            this.punchData = old.slice(0, old.length);
        } else if (chr == 0x00) {
            // nothing
        } else {
            // punch character
            const str = String.fromCharCode(chr);
            this.punchData = old + str;
        }
    }

    private loadFile(file: File): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                let data = reader.result as ArrayBuffer;
                resolve(data);
            };
            reader.onerror = () => {
                reject();
            }
            reader.readAsArrayBuffer(file);
        });
    }

    @computed
    public get panel(): FrontPanelState {
        return this.frontPanel;
    }

    @computed
    public get punchOutput() {
        return this.punchData;
    }

    public setPanelSwitch(sw: string, state: boolean): void {
        this.socket.emit('console-switch', {'switch': sw, 'state': state});
    }

    public appendReaderKey(chr: ArrayBuffer) {
        this.socket.emit('peripheral-action', {
            devId: 1,
            action: 'append-data',
            data: chr
        });
    }

    public async loadASR33Tape(tape: File) {
        let data = await this.loadFile(tape);
        this.socket.emit('peripheral-action', {
            devId: 1,
            action: 'set-data',
            data: data
        });
    }

    public async loadPR8Tape(tape: File) {
        let data = await this.loadFile(tape);
        this.socket.emit('peripheral-action', {
            devId: 2,
            action: 'set-data',
            data: data
        });
    }

    @action
    public clearASR33Punch() {
        this.punchData = '';
    }
}
