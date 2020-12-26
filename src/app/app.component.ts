import { Component, OnChanges, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from './resource-entity/navigation.entity';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { StoreService } from './store/store.service';
import { LeftSidenavStore } from './store/class/left-sidenav.store';
import { CatalogStore } from './store/class/catalog.store';
import { NavigationStore } from './store/class/navigation.store';
import { RouterDataStore } from './store/class/router-data.store';
import { selectFooter } from '@project-store';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUrl = '';
  footer$: Observable<any> = of({});
  layoutMap = new Map([
    [
      '(max-width: 599px)',
      async (e: BreakpointState) => {
        this.storeService.getStore(LeftSidenavStore).CHANGE_MODE({ value: 'over' });
        this.storeService.getStore(LeftSidenavStore).CLOSE();
        await this.storeService.select(CatalogStore).toPromise();
        this.catalogStore.CLOSE();
      },
    ],
    [
      '(min-width: 600px) and (max-width: 1279px)',
      async (e: BreakpointState) => {
        this.storeService.getStore(LeftSidenavStore).CHANGE_MODE({ value: 'side' });
        this.storeService.getStore(LeftSidenavStore).OPEN();
        await this.storeService.select(CatalogStore).toPromise();
        this.catalogStore.CLOSE();
      },
    ],
    [
      '(min-width: 1280px)',
      async (e: BreakpointState) => {
        this.storeService.getStore(LeftSidenavStore).CHANGE_MODE({ value: 'side' });
        this.storeService.getStore(LeftSidenavStore).OPEN();
        this.catalogStore.OPEN();
      },
    ],
  ]);
  catalogStore: CatalogStore;
  constructor(
    private store: Store,
    private repository: CyiaRepositoryService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private storeService: StoreService
  ) {
    this.catalogStore = this.storeService.getStore(CatalogStore);
    this.repository.findOne(NavigationEntity).subscribe((entity) => {
      this.storeService.getStore(NavigationStore).INIT({ value: entity });
    });
    router.events
      .pipe(
        // tap((e) => {
        //   console.log('查看', e);
        // }),
        filter((e) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => e.urlAfterRedirects),
        map((url) => {
          const urlTree = this.router.parseUrl(url);
          urlTree.fragment = undefined;
          if (urlTree.toString() === this.currentUrl) {
            return undefined;
          }
          this.currentUrl = urlTree.toString();
          return urlTree.toString();
        }),
        filter(Boolean),
        switchMap((e: string) => this.repository.findMany(RouterDataEntity, e).pipe(map((result) => ({ link: e, list: result }))))
      )

      .subscribe((e) => {
        this.storeService.getStore(RouterDataStore).ADD(e);
      });
    this.footer$ = this.storeService.select(NavigationStore).pipe(selectFooter);
  }
  ngOnInit(): void {
    this.mediaChange();
  }
  mediaChange() {
    this.layoutMap.forEach((value, key) => {
      this.breakpointObserver
        .observe(key)
        .pipe(filter((val) => val.matches))
        .subscribe(value);
    });
  }
}
