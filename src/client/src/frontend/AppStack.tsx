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

import { ThemeProvider } from "@emotion/react";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./AppRouter";
import { socdp8Theme } from "./layout/Theme";

export function AppStack() {
    return (
        <StrictMode>
            <ThemeProvider theme={socdp8Theme}>
                <RouterProvider router={appRouter} />
            </ThemeProvider>
        </StrictMode>
    );
}
