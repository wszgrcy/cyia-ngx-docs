import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const selectRouterData = pipe(
  filter((e) => {
    return !!e;
  })
);
