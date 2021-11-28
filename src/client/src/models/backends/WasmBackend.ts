/*
 *   SoCDP8 - A PDP-8/I implementation on a SoC
 *   Copyright (C) 2021 Folke Will <folko@solhost.org>
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

import { DeviceID, PeripheralConfiguration } from '../../types/PeripheralTypes';
import { SystemConfiguration } from '../../types/SystemConfiguration';
import { Backend } from './Backend';
import { BackendListener } from './BackendListener';
import { Wasm8Context } from './wasm/Wasm8Context';

export class WasmBackend implements Backend {
    private listener?: BackendListener;
    private pdp8: Wasm8Context;

    private systems: SystemConfiguration[] = [
        {
            id: "defauilt",
            name: "default",
            description: "default",
            maxMemField: 7,
            cpuExtensions: {
                eae: false,
                kt8i: false,
            },
            peripherals: [
                {
                    id: DeviceID.DEV_ID_PT08,
                    eightBit: false,
                    baudRate: 2400,
                },
            ],
        },
    ];

    public constructor() {
        this.pdp8 = new Wasm8Context();
    }

    public async connect(listener: BackendListener) {
        this.listener = listener;

        await this.pdp8.create((dev, action, data) => {
            if (dev == 4) {
                if (action == 1) {
                    listener.onPeripheralEvent({
                        id: DeviceID.DEV_ID_PT08,
                        action: "punch",
                        data: data,
                    });
                }
            }
        });
        this.listener.onConnect();

        setInterval(() => {
            listener.onConsoleState(this.pdp8.getConsoleState());
        }, 10);
    }

    public async readActiveSystem(): Promise<SystemConfiguration> {
        return this.systems[0];
    }

    public async saveActiveSystem(): Promise<boolean> {
        return true;
    }

    public async readSystems(): Promise<SystemConfiguration[]> {
        return this.systems;
    }

    public async createSystem(system: SystemConfiguration) {
    }

    public async setActiveSystem(id: string) {
    }

    public async deleteSystem(id: string) {
    }

    public async setPanelSwitch(sw: string, state: boolean): Promise<void> {
        this.pdp8.setSwitch(sw, state);
    }

    public async clearCore() {
    }

    public async writeCore(addr: number, fragment: number[]) {
        for (let i = 0; i < fragment.length; i++) {
            this.pdp8.writeCore(addr + i, fragment[i]);
        }
    }

    public async sendPeripheralAction(id: DeviceID, action: string, data: any): Promise<void> {
        if (id == DeviceID.DEV_ID_PT08) {
            if (action == "key-press") {
                this.pdp8.sendPeripheralAction(3, 1, data);
            }
        }
    }

    public async changePeripheralConfig(id: DeviceID, config: PeripheralConfiguration): Promise<void> {
    }

    public async readPeripheralBlock(id: DeviceID, block: number): Promise<Uint16Array> {
        return Uint16Array.from([]);
    }
}
