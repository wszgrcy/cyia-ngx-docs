import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

const selector = createFeatureSelector('docRenderer');

export const selectDocRenderer = createSelector(selector, (e: any, props) => {
  if (!e) {
    return undefined;
  }
  if (e.sum !== e.current) {
    return undefined;
  }
  return true;
});
