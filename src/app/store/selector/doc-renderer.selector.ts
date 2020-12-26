import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';


export const selectDocRenderer = pipe(
  map((e: any) => {
    if (!e) {
      return undefined;
    }
    if (e.sum !== e.current) {
      return undefined;
    }
    return true;
  })
);
