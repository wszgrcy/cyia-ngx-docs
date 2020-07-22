import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'property-table',
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.scss'],
})
export class PropertyTableComponent implements OnInit, OnChanges {
  @Input() ngInputProperty;
  constructor() {}
  rowList = ['name', 'type', 'description', 'isOptional', 'defaultValue'];
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.ngInputProperty);
  }
}
