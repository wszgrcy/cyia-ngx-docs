import { createAction, props } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';
const LEFT_SIDENAV = `[LEFTSIDENAV] `;
export const INIT = createAction(
  `${LEFT_SIDENAV}init`,
  props<{ value: MatSidenav }>()
);
export const OPEN = createAction(`${LEFT_SIDENAV}open`);
export const CLOSE = createAction(`${LEFT_SIDENAV}close`);
export const TOGGLE = createAction(`${LEFT_SIDENAV}toggle`);
export const CHANGE_MODE = createAction(
  `${LEFT_SIDENAV}changemode`,
  props<{ value: MatSidenav['mode'] }>()
);
