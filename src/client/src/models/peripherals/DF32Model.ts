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
import { DF32Configuration } from "../../types/PeripheralTypes";
import { Backend } from "../backends/Backend";

export class DF32Model extends PeripheralModel {
    constructor(backend: Backend, private conf: DF32Configuration) {
        super(backend);
    }

    public get config(): DF32Configuration {
        return this.conf;
    }

    public onPeripheralAction(action: string, data: any): void {
    }

    public get connections(): number[] {
        return [0o60, 0o61, 0o62];
    }
}
