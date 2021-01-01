import { OnChanges, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
export interface DynamicLoadingElement {
  selector: string;
}
export interface DynamicLoadingComponent extends OnChanges {
  renderFinish?: Observable<void>;
}
