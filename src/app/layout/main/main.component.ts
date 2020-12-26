import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store, select } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from '../../resource-entity/navigation.entity';
import { StoreService } from '../../store/store.service';
import { LeftSidenavStore } from '../../store/class/left-sidenav.store';
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(MatSidenav, { static: true }) set matSidenav(value: MatSidenav) {
    // console.log(value);
    this.storeService.getStore(LeftSidenavStore).INIT({ value });
  }
  constructor(private store: Store, private repository: CyiaRepositoryService, private storeService: StoreService) {
    // this.store.pipe();
  }

  ngOnInit() {}
}
