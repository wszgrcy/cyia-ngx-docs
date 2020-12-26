import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { LeftSidenavStore } from '../../store/class/left-sidenav.store';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  host: {
    class: 'mat-elevation-z6',
  },
})
export class ToolbarComponent implements OnInit {
  constructor( private storeService: StoreService) {}

  ngOnInit() {}
  toggle() {
    this.storeService.getStore(LeftSidenavStore).TOGGLE();
  }
  // doSearch() {
  //   console.log();
  // }
}
