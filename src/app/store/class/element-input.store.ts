import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { StoreBase } from '../store.types';

interface ElementIput {
  index: number;
  property: any;
}
@NgrxStore()
export class ElementInputPropertyStore implements StoreBase {
  initState = [];
  state: ElementIput[];
  @NgrxAction()
  ADD(action: ElementIput) {
    this.state[action.index] = action;
  }
}
