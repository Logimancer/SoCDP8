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

import {
    PeripheralConfiguration, DeviceID,
    PC04Configuration, PT08Configuration, TC08Configuration, RF08Configuration, PT08Style
} from "./PeripheralTypes";

export interface SystemConfiguration {
    id: string;
    name: string;
    description: string;

    cpuExtensions: {
        eae: boolean;
        kt8i: boolean;
        bsw: boolean;
    };

    maxMemField: number;

    peripherals: PeripheralConfiguration[];
}

export function getDefaultSysConf(): SystemConfiguration {
    return {
        id: "default",
        name: "default",
        description: "",
        maxMemField: 7,
        cpuExtensions: {
            eae: false,
            kt8i: false,
            bsw: false,
        },
        peripherals: [
            {
                id: DeviceID.DEV_ID_PT08,
                baudRate: 110,
                autoCaps: true,
                style: PT08Style.ASR33,
                eightBit: true,
            },
            {
                id: DeviceID.DEV_ID_PC04,
                baudRate: 4800,
            },
            {
                id: DeviceID.DEV_ID_TC08,
                numTapes: 2,
            },
            {
                id: DeviceID.DEV_ID_RF08,
            },
        ]
    };
}
