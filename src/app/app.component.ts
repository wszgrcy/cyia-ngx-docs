import { Component, OnChanges, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from './resource-entity/navigation.entity';
import * as navigation from '@rxactions/navigation.actions';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import * as routerData from '@rxactions/router-data.actions';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as leftsidenav from '@rxactions/left-sidenav.acitons';
import * as catalog from '@rxactions/catalog.acitons';
import { selectCatalog } from './selector/catalog.selector';
import { Observable, of } from 'rxjs';
import { selectFooter } from '@rxselectors/navigation.selector';
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
        this.store.dispatch(leftsidenav.CHANGE_MODE({ value: 'over' }));
        this.store.dispatch(leftsidenav.CLOSE());
        await this.store.pipe(selectCatalog).toPromise();
        this.store.dispatch(catalog.CLOSE());
      },
    ],
    [
      '(min-width: 600px) and (max-width: 1279px)',
      async (e: BreakpointState) => {
        this.store.dispatch(leftsidenav.CHANGE_MODE({ value: 'side' }));
        this.store.dispatch(leftsidenav.OPEN());
        await this.store.pipe(selectCatalog).toPromise();
        this.store.dispatch(catalog.CLOSE());
      },
    ],
    [
      '(min-width: 1280px)',
      async (e: BreakpointState) => {
        this.store.dispatch(leftsidenav.CHANGE_MODE({ value: 'side' }));
        this.store.dispatch(leftsidenav.OPEN());
        this.store.dispatch(catalog.OPEN());
      },
    ],
  ]);
  constructor(
    private store: Store,
    private repository: CyiaRepositoryService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.repository.findOne(NavigationEntity).subscribe((entity) => {
      this.store.dispatch(navigation.INIT({ value: entity }));
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
        this.store.dispatch(routerData.ADD(e));
      });
    this.footer$ = this.store.pipe(selectFooter);
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
