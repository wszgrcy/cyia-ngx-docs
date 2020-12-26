import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
@NgrxStore()
export class DocRendererStore implements StoreBase {
  readonly initState: { link: string; sum: number; current: number } = {
    link: undefined,
    sum: undefined,
    current: 0,
  };
  state: { link: string; sum: number; current: number };
  @NgrxAction()
  SUM(action: { sum: number }) {
    return { ...this.state, sum: action.sum };
  }
  @NgrxAction()
  COMPLETE() {
    return { ...this.state, sum: 1, current: 1 };
  }
  @NgrxAction()
  COMPLETE_ONE() {
    return { ...this.state, current: this.state.current + 1 };
  }
  @NgrxAction()
  RESET(action: { link: string }) {
    return { sum: undefined, current: 0, link: action.link };
  }
}
