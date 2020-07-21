import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'flex-layout',
  templateUrl: './flex-layout.component.html',
  styleUrls: ['./flex-layout.component.scss'],
})
export class FlexLayoutComponent implements OnInit {
  hostElement: HTMLElement;
  @Input() ngInputProperty: { flexList: string[] };
  constructor(private elementRef: ElementRef) {
    this.hostElement = elementRef.nativeElement;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    // console.log('值', changes);
    // console.dir(this.hostElement);
    this.ngInputProperty.flexList.forEach((item, i) => {
      (this.hostElement.children[i] as HTMLElement).style.flex = item;
    });
  }
}
