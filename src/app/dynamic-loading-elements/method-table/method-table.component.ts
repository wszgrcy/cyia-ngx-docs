import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'method-table',
  templateUrl: './method-table.component.html',
  styleUrls: ['./method-table.component.scss'],
})
export class MethodTableComponent implements OnInit {
  @Input() ngInputProperty;
  constructor() {}
  columnList = ['名字', '方法', '传入参数', '返回值'];
  rowList = ['name', 'description', 'docParameters', 'returnType'];
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.ngInputProperty);
  }
}
