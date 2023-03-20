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

import { PeripheralModel } from "./PeripheralModel";
import { DeviceID, DF32Configuration } from "../../types/PeripheralTypes";
import { Backend } from "../backends/Backend";
import { PeripheralInAction } from "../../types/PeripheralAction";
import { loadFile } from "../../util";

export class DF32Model extends PeripheralModel {
    private dumpAcceptor?: (dump: Uint8Array) => void;

    constructor(backend: Backend, private conf: DF32Configuration) {
        super(backend);
    }

    public get id() {
        return this.conf.id;
    }

    public get connections(): number[] {
        return [0o60, 0o61, 0o62, 0o63];
    }

    public onPeripheralAction(id: DeviceID, action: PeripheralInAction) {
        if (action.type == "core-dump") {
            if (this.dumpAcceptor) {
                this.dumpAcceptor(action.dump);
            }
        }
    }

    public async getDump(): Promise<Uint8Array> {
        return new Promise<Uint8Array>(accept => {
            this.dumpAcceptor = accept;
            void this.backend.sendPeripheralAction(DeviceID.DEV_ID_DF32, {type: "get-core"});
        });
    }

    public async loadDump(dump: File) {
        const data = await loadFile(dump);
        await this.backend.sendPeripheralAction(this.conf.id, {
            type: "load-core",
            data: new Uint8Array(data),
        });
    }
}
