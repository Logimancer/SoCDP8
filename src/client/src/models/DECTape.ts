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

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TapeState {
    address: number;
    loaded: boolean;
    normalizedPosition: number;
    moving: boolean;
    reverse: boolean;
    selected: boolean;
    writing: boolean;
}

interface TapeStore {
    state: TapeState;
    setState: (newState: TapeState) => void;
}

export class DECTape {
    private store = create<TapeStore>()(immer(set => ({
        state: {
            address: 0,
            loaded: false,
            normalizedPosition: 0,
            moving: false,
            reverse: false,
            selected: false,
            writing: false,
        },
        setState: (newState: TapeState) => set(draft => {
            draft.state = newState;
        })
    })));

    public get useTape() {
        return this.store;
    }
}
