import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { inputPropertyChange } from '../../utils/input-property-change';
import { StoreService } from '../../store/store.service';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';

@Component({
  selector: 'property-table',
  templateUrl: './property-table.component.html',
  styleUrls: ['./property-table.component.scss'],
})
export class PropertyTableComponent implements OnInit, OnChanges {
  @Input() index;
  @ViewChildren('panel') panelList: QueryList<MatExpansionPanel>;
  constructor(private storeService: StoreService) {}
  @Input() list: any[];
  rowList = ['name', 'type', 'description', 'isOptional', 'defaultValue'];
  typeLinks = [];
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((result) => {
          this.list = result.property;
        });
    }
    this.list.forEach((e) => {
      if (e.typeLink) {
        this.typeLinks.push({ key: e.type, value: e.typeLink });
        // this.typeLinks[e.type] = e.typeLink;
      }
    });
  }
  openPanel(type) {
    const index = this.typeLinks.findIndex((link) => link.key === type);
    this.panelList.forEach((panel, i) => {
      if (i === index) {
        panel.toggle();
      }
    });
  }
}
