import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
@NgrxStore()
export class RouterDataStore implements StoreBase<{ [routerLink: string]: any[] }> {
  readonly initState = {};
  state: { [routerLink: string]: RouterDataEntity[] };
  @NgrxAction()
  ADD(action: { link: string; list: any[] }) {
    this.state[action.link] = action.list;
    return { ...this.state };
  }
}
