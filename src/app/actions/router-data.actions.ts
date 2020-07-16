import { createAction, props } from '@ngrx/store';
const NAVIGATION = `[ROUTER-DATA] `;
export const ADD = createAction(
  `${NAVIGATION}add`,
  props<{ link: string; list: any[] }>()
);
export const GET = createAction(
  `${NAVIGATION}get`,
  props<{ link: string;  }>()
);
