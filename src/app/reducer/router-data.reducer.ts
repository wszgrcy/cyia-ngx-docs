import { createReducer, on } from '@ngrx/store';

import * as routerData from '@rxactions/router-data.actions';
import { NavigationEntity } from '@resource-entity/navigation.entity';

const data: { [routerLink: string]: any[] } = {};

const _routerDataReducer = createReducer(
  data,
  on(routerData.ADD, (state, action) => {
    console.log('保存渲染数据', action);
    state[action.link] = action.list;
    console.log('状态', state);
    return { ...state };
  })
  //   on(routerData.GET, (state, action) => {
  //     console.log('导航?', action);
  //     state[action.link] = action.list;
  //     return state;
  //   })
);

export function routerDataReducer(state, action) {
  return _routerDataReducer(state, action);
}
