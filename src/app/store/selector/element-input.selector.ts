import { pipe, UnaryFunction, Observable } from 'rxjs';
import { filter, map, takeUntil, takeWhile } from 'rxjs/operators';
export function elementInputSelector<T>(index: string): UnaryFunction<Observable<T[]>, Observable<T>> {
  return pipe(
    filter((e) => !!e),
    map((list) => list[index]),
    filter((e) => !!e)
  );
}
export function getElementInputProperty<T>(indexFn: () => string): UnaryFunction<Observable<T[]>, Observable<T>> {
  return pipe(
    takeWhile(() => Number.isInteger(Number.parseInt(indexFn(), 10))),
    elementInputSelector(indexFn())
  );
}
