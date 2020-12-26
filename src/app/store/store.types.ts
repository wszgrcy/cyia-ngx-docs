import { Type } from '@angular/core';

export interface GenerateStoreConfig {
  name: string;
  type: Type<any>;
}
export interface GenerateActionConfig {
  name: string;
  on: Function;
}
export interface StoreBase<T = any> {
  initState: T;
  state: T;
}
