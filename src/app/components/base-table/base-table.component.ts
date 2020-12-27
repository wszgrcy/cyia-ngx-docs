import { Component, OnInit, Input, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { JsonParse } from '../../decorators/json-parse.decorator';
import { StoreService } from '../../store/store.service';
import { inputPropertyChange } from '../../utils/input-property-change';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
@Component({
  selector: 'base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css'],
})
export class BaseTableComponent implements OnInit, OnChanges {
  @Input() index;
  @Input() headers = undefined;
  @Input() aligns = '';
  @Input() data = '';
  _headers: string[] = [];
  _aligns: string[] = [];
  _data: string[] = [];
  fileds = [];
  constructor(private storeService: StoreService, private elementRef: ElementRef) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((property) => {
          for (const key in property) {
            if (Object.prototype.hasOwnProperty.call(property, key)) {
              const element = property[key];
              this.elementRef.nativeElement[key] = element;
            }
          }
        });
    }
    if (this.headers && changes.headers) {
      this._headers = JSON.parse(this.headers);
      this._headers.forEach((a, i) => {
        this.fileds.push(`field${i}`);
      });
    }
    if (this.aligns && changes.aligns) {
      this._aligns = JSON.parse(this.aligns);
    }
    if (this.data && changes.data) {
      this._data = JSON.parse(this.data);
    }
    console.log(this._data, this._aligns, this._headers, this.fileds);
  }
}
