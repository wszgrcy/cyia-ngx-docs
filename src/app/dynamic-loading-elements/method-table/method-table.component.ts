import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { inputPropertyChange } from '../../utils/input-property-change';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputSelector } from '../../store/selector/element-input.selector';

@Component({
  selector: 'method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss'],
})
export class MethodTableComponent implements OnInit, OnChanges {
  @Input() data: any[];
  @Input() index;
  constructor(private storeService: StoreService) {}
  columnList = ['名字', '方法', '传入参数', '返回值'];
  rowList = ['name', 'description', 'docParameters', 'returnType'];
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputSelector(this.index))
        .subscribe((result) => {
          this.data = result.property;
        });
    }
  }
}
