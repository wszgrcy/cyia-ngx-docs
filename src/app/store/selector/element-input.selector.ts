import { pipe, UnaryFunction, Observable } from 'rxjs';
import { filter, map, takeUntil, takeWhile } from 'rxjs/operators';
export function elementInputPropertySelector<T>(index: string): UnaryFunction<Observable<T[]>, Observable<T>> {
  return pipe(
    filter((e) => !!e),
    map((list) => list[index]),
    filter((e) => !!e)
  );
}
