import { createReducer, on } from '@ngrx/store';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';

import * as catalog from '@rxactions/catalog.acitons';
import { DocCatalogComponent } from '../dynamic-loading-elements/doc-catalog/doc-catalog.component';

const matDrawer: DocCatalogComponent = undefined;

const _catalogReducer = createReducer(
  matDrawer,
  on(catalog.INIT, (state, action) => {
    return action.value;
  }),
  on(catalog.OPEN, (state) => {
    if (state) {
      state.open();
    }
    return state;
  }),
  on(catalog.CLOSE, (state) => {
    if (state) {
      state.close();
    }
    return state;
  })
  // on(catalog.TOGGLE, (state) => {
  //   state.toggle();
  //   return state;
  // })
);

export function catalogReducer(state, action) {
  return _catalogReducer(state, action);
}
