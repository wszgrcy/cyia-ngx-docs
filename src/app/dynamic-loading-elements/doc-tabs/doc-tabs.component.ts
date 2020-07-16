import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doc-tabs',
  templateUrl: './doc-tabs.component.html',
  styleUrls: ['./doc-tabs.component.scss'],
})
export class DocTabsComponent implements OnInit {
  @Input() ngInputProperty: { title: string; url: string; selected: boolean }[] = [];
  constructor() {}

  ngOnInit() {}
}
