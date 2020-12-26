import { StoreBase } from '../store.types';
import { NgrxStore } from '../store.decorator';
import { NgrxAction } from '../action.decorator';
import { DocCatalogComponent } from '../../dynamic-loading-elements/doc-catalog/doc-catalog.component';
@NgrxStore()
export class CatalogStore implements StoreBase {
  readonly initState = undefined;
  state: DocCatalogComponent;
  @NgrxAction()
  INIT(action: { value: DocCatalogComponent }) {
    return action.value;
  }
  @NgrxAction()
  OPEN() {
    if (this.state) {
      this.state.open();
    }
    return this.state;
  }
  @NgrxAction()
  CLOSE() {
    if (this.state) {
      this.state.close();
    }
    return this.state;
  }
}
