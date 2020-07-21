import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from './resource-entity/navigation.entity';
import * as navigation from '@rxactions/navigation.actions';
import { selectLeftSideNav } from './selector/navigation.selector';
import { Router, NavigationStart } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { RouterDataEntity } from '@resource-entity/router-data.entity';
import * as routerData from '@rxactions/router-data.actions';
import { of } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentUrl = '';
  constructor(
    private store: Store,
    private repository: CyiaRepositoryService,
    private router: Router
  ) {
    this.repository.findOne(NavigationEntity).subscribe((entity) => {
      this.store.dispatch(navigation.INIT({ value: entity }));
    });
    router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        filter((e: NavigationStart) => e.url.startsWith('/doc')),
        map((e: NavigationStart) => e.url.replace(/^\/doc/, '')),
        map((url) => {
          console.log('链接', url);
          const urlTree = this.router.parseUrl(url);
          urlTree.fragment = undefined;
          console.log(urlTree.fragment);
          if (urlTree.toString() === this.currentUrl) {
            return undefined;
          }
          console.log('执行')
          this.currentUrl = urlTree.toString();
          return urlTree.toString();
        }),
        filter(Boolean),
        switchMap((e: string) =>
          this.repository
            .findMany(RouterDataEntity, e)
            .pipe(map((result) => ({ link: e, list: result })))
        )
      )

      .subscribe((e) => {
        this.store.dispatch(routerData.ADD(e));
        console.log('路由事件', e);
        // this.store.dispatch()
      });
  }
}
