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

import { Peripheral, IOContext, DeviceRegister, DeviceID } from '../drivers/IO/Peripheral';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { sleepMs, sleepUs } from '../sleep';

export class RK8 implements Peripheral {
    private readonly DEBUG = true;
    private readonly DATA_FILE = 'rk8.dat';
    private readonly SECTORS_PER_DISK = 203 * 16;
    private readonly WORDS_PER_SECTOR = 256;
    private readonly NUM_DISKS = 4;
    private data = Buffer.alloc(this.NUM_DISKS * this.SECTORS_PER_DISK * this.WORDS_PER_SECTOR * 2);

    constructor() {
        if (existsSync(this.DATA_FILE)) {
            const buf = readFileSync(this.DATA_FILE);
            buf.copy(this.data);
        }
    }

    public getDeviceID(): DeviceID {
        return DeviceID.DEV_ID_RK8;
    }

    public getBusConnections(): number[] {
        return [0o73, 0o74, 0o75];
    }

    public requestAction(action: string, data: any): void {
        switch (action) {
            case 'flush':
                writeFileSync(this.DATA_FILE, this.data);
                break;
        }
    }

    public async run(io: IOContext): Promise<void> {
        while (true) {
            const regA = io.readRegister(DeviceRegister.REG_A);

            if (regA & (1 << 13)) {
                // read
                await sleepMs(134);
                io.writeRegister(DeviceRegister.REG_A, regA & ~(1 << 13)); // remove request
                if (regA & (1 << 7)) {
                    console.log(`RK8: Surface-only read`);
                    this.setDoneFlag(io);
                    continue;
                }
                if (regA & (1 << 6)) {
                    console.log(`RK8: Header word read not supported`);
                    continue;
                }
                await this.doRead(io);
            } else if (regA & (1 << 14)) {
                // write
                await sleepMs(134);
                io.writeRegister(DeviceRegister.REG_A, regA & ~(1 << 14)); // remove request
                if (regA & (1 << 7)) {
                    console.log(`RK8: Surface-only write`);
                    this.setDoneFlag(io);
                    continue;
                }
                if (regA & (1 << 6)) {
                    console.log(`RK8: Header word write supported`);
                    continue;
                }
                await this.doWrite(io);
            } else if (regA & (1 << 15)) {
                // parity
                await sleepMs(134);
                io.writeRegister(DeviceRegister.REG_A, regA & ~(1 << 15)); // remove request
                console.log(`RK8: Unsupported operation DCHP`);
            } else {
                await sleepMs(1);
            }
        }
    }

    private async doRead(io: IOContext) {
        let sector = this.readSectorNum(io);

        if (this.DEBUG) {
            console.log(`RK8: Read sector ${sector}`)
        }

        let overflow = false;
        let i = 0;
        do {
            const data = this.data.readUInt16LE((sector * this.WORDS_PER_SECTOR + i) * 2);
            const memField = this.readMemField(io);
            const wc = this.readAndIncWC(io);
            const ca = this.readAndIncCA(io);

            await io.dataBreak({
                threeCycle: false,
                isWrite: true,
                data: data,
                address: ca,
                field: memField,
                incMB: false,
                incCA: false
            });

            overflow = (wc == 0);

            i++;
            if (i == this.WORDS_PER_SECTOR) {
                i = 0;
                sector++;
                this.writeSectorNum(io, sector);
                if (sector % 16 == 0) {
                    // overflow = true;
                }
            }

            await sleepUs(65);
        } while (!overflow);

        this.setDoneFlag(io);
    }

    private async doWrite(io: IOContext) {
        let sector = this.readSectorNum(io);

        if (this.DEBUG) {
            console.log(`RK8: Write sector ${sector}`)
        }

        let overflow = false;
        let i = 0;
        do {
            const memField = this.readMemField(io);
            const wc = this.readAndIncWC(io);
            const ca = this.readAndIncCA(io);

            const brkReply = await io.dataBreak({
                threeCycle: false,
                isWrite: false,
                data: 0,
                address: ca,
                field: memField,
                incMB: false,
                incCA: false
            });

            const data = brkReply.mb;
            this.data.writeUInt16LE(data, (sector * this.WORDS_PER_SECTOR + i) * 2);

            overflow = (wc == 0);

            i++;
            if (i == this.WORDS_PER_SECTOR) {
                i = 0;
                sector++;
                this.writeSectorNum(io, sector);
                if (sector % 16 == 0) {
                    // overflow = true;
                }
            }

            await sleepUs(65);
        } while (!overflow);

        this.setDoneFlag(io);
    }

    private readMemField(io: IOContext): number {
        const regA = io.readRegister(DeviceRegister.REG_A);
        return (regA & 0o0070) >> 3;
    }

    private readSectorNum(io: IOContext): number {
        const regA = io.readRegister(DeviceRegister.REG_A);
        const regB = io.readRegister(DeviceRegister.REG_B);

        const diskNum = (regA & 7) >> 1;
        const sector = regB;

        return diskNum * this.SECTORS_PER_DISK + sector;
    }

    private writeSectorNum(io: IOContext, sector: number): void {
        io.writeRegister(DeviceRegister.REG_B, sector % this.SECTORS_PER_DISK);
    }

    private readAndIncWC(io: IOContext): number {
        const oldWc = io.readRegister(DeviceRegister.REG_D);
        const newWc = (oldWc + 1) & 0o7777;
        io.writeRegister(DeviceRegister.REG_D, newWc);
        return newWc;
    }

    private readAndIncCA(io: IOContext): number {
        const oldCa = io.readRegister(DeviceRegister.REG_E);
        const newCa = (oldCa + 1) & 0o7777;
        io.writeRegister(DeviceRegister.REG_E, newCa);
        return newCa;
    }

    private setDoneFlag(io: IOContext) {
        const regC = io.readRegister(DeviceRegister.REG_C);
        io.writeRegister(DeviceRegister.REG_C, regC | (1 << 10));
    }
}
