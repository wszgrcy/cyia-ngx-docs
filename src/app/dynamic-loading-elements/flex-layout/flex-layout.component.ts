import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as leftsidenav from '@rxactions/left-sidenav.acitons';
@Component({
  selector: 'flex-layout',
  templateUrl: './flex-layout.component.html',
  styleUrls: ['./flex-layout.component.scss'],
  host: {},
})
export class FlexLayoutComponent implements OnInit {
  hostElement: HTMLElement;
  @Input() ngInputProperty: { flexList: string[] };

  constructor(
    private elementRef: ElementRef,
    private breakpointObserver: BreakpointObserver,
    private store: Store
  ) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.ngInputProperty.flexList.forEach((item, i) => {
      (this.hostElement.children[
        i
      ] as HTMLElement).style.flex = item;
    });
  }
}
