import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as leftsidebar from '@rxactions/left-sidenav.acitons';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  host: {
    class: 'mat-elevation-z6',
  },
})
export class ToolbarComponent implements OnInit {
  constructor(public store: Store) {}

  ngOnInit() {}
  toggle() {
    this.store.dispatch(leftsidebar.TOGGLE());
  }
  // doSearch() {
  //   console.log();
  // }
}
