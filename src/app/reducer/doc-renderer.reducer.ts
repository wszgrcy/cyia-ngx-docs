import { createReducer, on } from '@ngrx/store';

import * as actions from '@rxactions/doc-renderer.actions';

const data: { link: string; sum: number; current: number } = {
  link: undefined,
  sum: undefined,
  current: 0,
};

const _docRendererReducer = createReducer(
  data,
  on(actions.RESET, (state, action) => {
    return { sum: undefined, current: 0, link: action.link };
  }),
  on(actions.COMPLETE_ONE, (state, action) => {
    return { ...state, current: state.current + 1 };
  }),
  on(actions.SUM, (state, action) => {
    return { ...state, sum: action.sum };
  }),
  on(actions.COMPLETE, (state) => {
    return { ...state, sum: 1, current: 1 };
  })
);

export function docRendererReducer(state, action) {
  return _docRendererReducer(state, action);
}
