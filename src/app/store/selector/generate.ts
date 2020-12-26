import { MemoizedSelector } from '@ngrx/store';
import { pipe, UnaryFunction, Observable } from 'rxjs';

export function generateSelector(selector: MemoizedSelector<any, any, any>) {
  return (
    fn: (selector: MemoizedSelector<any, any, any>) => UnaryFunction<Observable<any>, Observable<any>>
  ): UnaryFunction<Observable<any>, Observable<any>> => fn(selector);
}
