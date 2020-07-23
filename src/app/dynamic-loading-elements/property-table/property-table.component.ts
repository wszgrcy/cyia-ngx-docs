import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'property-table',
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.scss'],
})
export class PropertyTableComponent implements OnInit, OnChanges {
  @ViewChildren('panel') panelList: QueryList<MatExpansionPanel>;
  constructor() {}
  @Input() ngInputProperty: any[];
  rowList = ['name', 'type', 'description', 'isOptional', 'defaultValue'];
  typeLinks = [];
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('属性', this.ngInputProperty);
    this.ngInputProperty.forEach((e) => {
      if (e.typeLink) {
        this.typeLinks.push({ key: e.type, value: e.typeLink });
        // this.typeLinks[e.type] = e.typeLink;
      }
    });
    console.log(this.typeLinks);
  }
  openPanel(type) {
    const index = this.typeLinks.findIndex((link) => link.key === type);
    this.panelList.forEach((panel, i) => {
      console.log(panel, i, index);
      if (i === index) {
        panel.toggle();
      }
    });
  }
}
