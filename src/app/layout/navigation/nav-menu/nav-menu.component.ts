import {
  Component,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationNode } from '@resource-entity/navigation.entity';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from '../../../resource-entity/navigation.entity';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectLeftSideNav } from '../../../selector/navigation.selector';
import * as navigation from "@rxactions/navigation.actions";
@Component({
  selector: 'left-sidenav-menu',
  template: ` <aio-nav-item
    *ngFor="let node of nodes|async"
    [node]="node"
    [selectedNode]="selectedNode"
    [isWide]="isWide"
  >
  </aio-nav-item>`,
  styleUrls: ['./nav-menu.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSidenavMenuComponent {
  @Input() selectedNode: NavigationNode;
  @Input() isWide = true;
  nodes = this.store.pipe(selectLeftSideNav)
  // get filteredNodes() {
  //   return this.nodes ? this.nodes.filter((n) => !n.hidden) : [];
  // }
  pathChange: Subscription;
  constructor(private store: Store) {
    // console.log('初始化111')
    // this.nodes.subscribe((item) => {
    //   console.log('借点测试',item);
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodes && this.nodes) {
      this.pathChange && this.pathChange.unsubscribe();

      // this.pathChange = this.mainRouterService.navigationPath.subscribe((e) => {
      //   this.selectedNode = this.mainRouterService.getNode(this.nodes, e)
      //   console.log(this.selectedNode)
      // })
    }
  }
}
