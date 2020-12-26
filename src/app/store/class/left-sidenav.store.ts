import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { MatSidenav } from '@angular/material/sidenav';
@NgrxStore()
export class LeftSidenavStore implements StoreBase {
  readonly initState: MatSidenav = undefined;
  state: MatSidenav;
  @NgrxAction()
  INIT(action: { value: MatSidenav }) {
    return action.value;
  }
  @NgrxAction()
  OPEN() {
    this.state.open();
    return this.state;
  }
  @NgrxAction()
  CLOSE() {
    this.state.close();
    return this.state;
  }
  @NgrxAction()
  TOGGLE() {
    this.state.toggle();
    return this.state;
  }
  @NgrxAction()
  CHANGE_MODE(action: { value: MatSidenav['mode'] }) {
    this.state.mode = action.value;
    return this.state;
  }
}
