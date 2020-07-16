import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

const routerData = createFeatureSelector('routerData');

export const selectRouterData = pipe(
  select(
    createSelector(routerData, (e: any) => {
      if (!e) {
        return undefined;
      }
      return e;
    })
  ),
  filter((e) => {
    return !!e;
  })
);
