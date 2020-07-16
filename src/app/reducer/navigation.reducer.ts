import { createReducer, on } from '@ngrx/store';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';

import * as navigation from '@rxactions/navigation.actions';
import { NavigationEntity } from '@resource-entity/navigation.entity';

const matDrawer: NavigationEntity = undefined;

const _navigationReducer = createReducer(
  matDrawer,
  on(navigation.INIT, (state, action) => {
    console.log('导航?', action.value);
    return action.value;
  })
);

export function navigationReducer(state, action) {
  return _navigationReducer(state, action);
}
