import { pipe, UnaryFunction, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RouterDataEntity } from '@resource-entity/router-data.entity';

export const selectRouterData: UnaryFunction<
  Observable<{ [routerLink: string]: RouterDataEntity[] }>,
  Observable<{ [routerLink: string]: RouterDataEntity[] }>
> = pipe(
  filter((e) => {
    return !!e;
  })
);
