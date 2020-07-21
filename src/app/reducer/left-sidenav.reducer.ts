import { createReducer, on } from '@ngrx/store';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';

import * as leftsidebar from '@rxactions/left-sidenav.acitons';
// import * as actions from '@rxactions/doc-renderer.actions';

const matDrawer: MatSidenav = undefined;

const _leftSidenavReducer = createReducer(
  matDrawer,
  on(leftsidebar.INIT, (state, action) => {
    return action.value;
  }),
  on(leftsidebar.OPEN, (state) => {
    state.open();
    return state;
  }),
  on(leftsidebar.CLOSE, (state) => {
    state.close();
    return state;
  }),
  on(leftsidebar.TOGGLE, (state) => {
    state.toggle();
    return state;
  }),
  on(leftsidebar.CHANGE_MODE, (state, actions) => {
    // console.log(actions);
    // debugger;
    state.mode = actions.value;
    // console.log(state.mode);
    return state;
  })
);

export function leftSidenavReducer(state, action) {
  return _leftSidenavReducer(state, action);
}
