import { createSelector, createFeatureSelector, select, MemoizedSelector } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const selectRouterData = pipe(
  filter((e) => {
    return !!e;
  })
);
