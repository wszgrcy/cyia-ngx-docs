import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import * as leftsidenav from '@rxactions/left-sidenav.acitons';
import { HttpClient } from '@angular/common/http';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from '../../resource-entity/navigation.entity';
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(MatSidenav, { static: true }) set matSidenav(value: MatSidenav) {
    // console.log(value);
    this.store.dispatch(leftsidenav.INIT({ value }));
    // this.store.dispatch(MENU_INIT(value));
  }
  constructor(private store: Store, private repository: CyiaRepositoryService) {
    // this.store.pipe();
  }

  ngOnInit() {}
}
