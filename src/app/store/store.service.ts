import { Injectable, Type } from '@angular/core';
import { Store, createFeatureSelector, select, On, createAction, props, on, createReducer, ActionCreator } from '@ngrx/store';
import { GenerateStoreConfig, GenerateActionConfig, StoreBase } from './store.types';
import { generateActionName } from './store.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  static storeConfigMap = new Map<Type<StoreBase>, GenerateStoreConfig>();
  static actionConfigMap = new Map<Type<StoreBase>, GenerateActionConfig[]>();
  static storeActionCreatorMap = new Map<Type<StoreBase>, Map<string, ActionCreator<string, (props: any) => any>>>();
  static storeMap = new Map<Type<any>, StoreBase>();
  static createReducer(actionsConfig: GenerateActionConfig[], storeConfig: GenerateStoreConfig, initState: any, instance: StoreBase) {
    const actionCreatorMap = new Map();
    const onList: On<any>[] = actionsConfig.map((item) => {
      const ACTION_NAME = generateActionName(storeConfig.name, item.name);
      const action = createAction(ACTION_NAME, props<any>());

      actionCreatorMap.set(ACTION_NAME, action);
      return on(action, (state, action) => {
        instance.state = state;
        return item.on.bind(instance)(action.value);
      });
    });
    this.storeActionCreatorMap.set(storeConfig.type, actionCreatorMap);
    return createReducer(initState, ...onList);
  }
  static getReducerMap(types: Type<StoreBase>[]) {
    return types.reduce((pre, Type) => {
      const storeConfig = StoreService.storeConfigMap.get(Type);
      const actionConfigList = StoreService.actionConfigMap.get(Type);
      const instance = new Type();
      const reducer = this.createReducer(actionConfigList, storeConfig, instance.initState, instance);
      StoreService.storeMap.set(Type, instance);
      pre[storeConfig.name] = reducer;
      return pre;
    }, {});
  }
  constructor(private store: Store) {}
  getStore<T extends StoreBase>(type: Type<T>): T {
    const storeConfig = StoreService.storeConfigMap.get(type);
    const instance = StoreService.storeMap.get(type);
    const actionCreatorMap = StoreService.storeActionCreatorMap.get(type);
    StoreService.actionConfigMap.get(type).forEach((cur) => {
      instance[cur.name] = (action) => {
        const actionCreator = actionCreatorMap.get(storeConfig.name + cur.name);
        this.store.dispatch(actionCreator({ value: action }));
      };
    });
    return instance as any;
  }
  select<T extends StoreBase>(type: Type<T>): Observable<T['state']> {
    const storeConfig = StoreService.storeConfigMap.get(type);
    return this.store.pipe(select(createFeatureSelector(storeConfig.name)));
  }
}
