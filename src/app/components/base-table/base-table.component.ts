import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { JsonParse } from '../../decorators/json-parse.decorator';
@Component({
  selector: 'base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.css'],
})
export class BaseTableComponent implements OnInit, OnChanges {
  @Input() headers = undefined;
  @Input() aligns = '';
  @Input() data = '';
  _headers: string[] = [];
  _aligns: string[] = [];
  _data: string[] = [];
  fileds = [];
  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('变更', changes);
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
