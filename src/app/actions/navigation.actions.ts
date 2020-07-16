import { createAction, props } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEntity } from '@resource-entity/navigation.entity';
const NAVIGATION = `[NAVIGATION] `;
export const INIT = createAction(
  `${NAVIGATION}init`,
  props<{ value: NavigationEntity }>()
);
// export const OPEN = createAction(`${NAVIGATION}open`);
// export const CLOSE = createAction(`${NAVIGATION}close`);
// export const TOGGLE = createAction(`${NAVIGATION}toggle`);
