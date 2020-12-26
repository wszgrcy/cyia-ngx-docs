import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { StoreBase } from '../store.types';
type State = { index: number; content: string; languageId: string }[];
@NgrxStore()
export class CodeHighlightStore implements StoreBase {
  readonly initState = [];
  state: State;
  constructor() {}
  @NgrxAction()
  GENERATE(action) {
    this.state[action.index] = action;
    return this.state;
  }
}
