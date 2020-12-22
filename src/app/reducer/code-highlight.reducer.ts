import { createAction, createReducer, on, props } from '@ngrx/store';
const CODE_HIGHLIGHT = `[CODE_HIGHLIGHT]`;
export const GENERATE = createAction(`${CODE_HIGHLIGHT}generate`, props<{ value: { index: number; content: string,languageId:string } }>());

export function codeHighlightReducer(state, action) {
  return createReducer(
    [],
    on(GENERATE, (state, action) => {
      state[action.value.index] = action.value;
      console.log('生成?');
      return state;
    })
  )(state, action);
}
