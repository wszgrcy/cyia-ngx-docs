import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { NavigationEntity } from '@resource-entity/navigation.entity';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

const navigation = createFeatureSelector('navigation');

export const selectLeftSideNav = pipe(
  select(
    createSelector(navigation, (e: NavigationEntity) => {
      // console.log('使用', e);
      if (!e) {
        return undefined;
      }
      return e.sideNav;
    })
  ),
  filter((e) => {
    return !!e;
  })
);
