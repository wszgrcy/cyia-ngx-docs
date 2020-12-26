import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
@NgrxStore()
export class RouterDataStore implements StoreBase<{ [routerLink: string]: any[] }> {
  readonly initState = {};
  state: { [routerLink: string]: any[] };
  @NgrxAction()
  ADD(action: { link: string; list: any[] }) {
    this.state[action.link] = action.list;
    return { ...this.state };
  }
}
