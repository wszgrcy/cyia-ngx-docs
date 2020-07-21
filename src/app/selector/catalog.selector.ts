import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, take } from 'rxjs/operators';

const selector = createFeatureSelector('catalog');

export const selectCatalog = pipe(
  select(
    createSelector(selector, (e: any) => {
      if (!e) {
        return undefined;
      }
      return e;
    })
  ),
  filter((e) => {
    return !!e;
  }),
  take(1)
);
