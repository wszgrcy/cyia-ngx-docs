import { NavigationEntity } from '@resource-entity/navigation.entity';
import { pipe } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export const selectLeftSideNav = pipe(
  filter((e) => !!e),
  map((e: NavigationEntity) => e.sideNav),
  filter((e) => !!e)
);
export const selectFooter = pipe(
  filter((e) => !!e),
  map((e: NavigationEntity) => e.footer),
  filter((e) => !!e)
);
