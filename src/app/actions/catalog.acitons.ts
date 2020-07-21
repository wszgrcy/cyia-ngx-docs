import { createAction, props } from '@ngrx/store';
import { MatSidenav } from '@angular/material/sidenav';
import { DocCatalogComponent } from '../dynamic-loading-elements/doc-catalog/doc-catalog.component';
const CATALOG = `[CATALOG] `;
export const INIT = createAction(
  `${CATALOG}init`,
  props<{ value: DocCatalogComponent }>()
);
export const OPEN = createAction(`${CATALOG}open`);
export const CLOSE = createAction(`${CATALOG}close`);
// export const TOGGLE = createAction(`${CATALOG}toggle`);
