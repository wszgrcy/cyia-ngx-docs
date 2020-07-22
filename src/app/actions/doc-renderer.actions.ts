import { createAction, props } from '@ngrx/store';
const DOC_RENDERER = `[DOC-RENDERER] `;
export const SUM = createAction(`${DOC_RENDERER}sum`, props<{ sum: number }>());
export const COMPLETE = createAction(
  `${DOC_RENDERER}complete`
  // props<{ link: string; list: any[] }>()
);
export const COMPLETE_ONE = createAction(
  `${DOC_RENDERER}completeone`
  // props<{ link: string; list: any[] }>()
);
export const RESET = createAction(
  `${DOC_RENDERER}clear`,
  props<{ link: string }>()
);
