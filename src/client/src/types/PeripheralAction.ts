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

import { TapeState } from "../models/DECTape";

export type PeripheralOutAction =
    KeyPressAction | TapeSetAction | ReaderStateAction |
    LoadTapeAction;

export interface KeyPressAction {
    type: "key-press";
    key: number;
}

export interface TapeSetAction {
    type: "reader-tape-set";
    tapeData: Uint8Array;
}

export interface ReaderStateAction {
    type: "reader-set-active";
    active: boolean;
}

export interface LoadTapeAction {
    type: "load-tape";
    unit: number;
    data: Uint8Array;
}

export type PeripheralInAction =
    ActiveStateChangeAction | StateListChangeAction |
    ReaderPosAction | PunchAction |
    TapeStatusAction;

export interface ReaderPosAction {
    type: "readerPos",
    pos: number;
}

export interface PunchAction {
    type: "punch",
    char: number;
}

export interface TapeStatusAction {
    type: "tapeStates",
    states: TapeState[];
}

export interface ActiveStateChangeAction {
    type: "active-state-changed";
}

export interface StateListChangeAction {
    type: "state-list-changed";
}