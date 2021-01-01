import { SimpleChanges, SimpleChange } from '@angular/core';
export class InputChange {
  static inputMap = new Map<any, { [name: string]: any }>();
  static create<T>(instance: T, valueObject) {
    const input = this.inputMap.get(instance) || {};
    const simpleChanges: SimpleChanges = {};
    for (const key in valueObject) {
      if (Object.prototype.hasOwnProperty.call(valueObject, key)) {
        let isFirst = false;
        const value = valueObject[key];
        if (!Object.prototype.hasOwnProperty.call(input, key)) {
          isFirst = true;
        }
        simpleChanges[key] = new SimpleChange(input[key], value, isFirst);
        input[key] = value;
      }
    }
    this.inputMap.set(instance, input);
    return simpleChanges;
  }
  static clear() {
    this.inputMap.clear();
  }
}
