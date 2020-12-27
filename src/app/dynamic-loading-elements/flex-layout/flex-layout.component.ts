import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { OnChanges } from '@angular/core';
import { inputPropertyChange } from '../../utils/input-property-change';
import { StoreService } from '@project-store';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
@Component({
  selector: 'flex-layout',
  templateUrl: './flex-layout.component.html',
  styleUrls: ['./flex-layout.component.scss'],
  host: {},
})
export class FlexLayoutComponent implements OnInit, OnChanges {
  hostElement: HTMLElement;
  @Input() index: string;
  constructor(private elementRef: ElementRef, private breakpointObserver: BreakpointObserver, private storeService: StoreService) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe(({ property }) => {
          property.flexList.forEach((item, i) => {
            (this.hostElement.children[i] as HTMLElement).style.flex = item;
          });
        });
    }
  }
}
