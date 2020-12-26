import { StoreService } from './store.service';
import { Type } from '@angular/core';
export function NgrxStore() {
  return function (target: Type<any>) {
    StoreService.storeConfigMap.set(target, { name: Math.random().toString(36), type: target });
  };
}
