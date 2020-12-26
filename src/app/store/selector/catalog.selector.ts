import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { generateSelector } from './generate';

export const selectCatalog = pipe(
  map((e: any) => {
    if (!e) {
      return undefined;
    }
    return e;
  }),
  filter((e) => {
    return !!e;
  }),
  take(1)
);
