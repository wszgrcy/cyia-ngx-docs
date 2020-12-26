import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { NavigationEntity } from '@resource-entity/navigation.entity';
@NgrxStore()
export class NavigationStore implements StoreBase<NavigationEntity> {
  readonly initState = undefined;
  state: NavigationEntity;
  @NgrxAction()
  INIT(action: { value: NavigationEntity }) {
    return action.value;
  }
}
