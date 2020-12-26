import { Component, Input, SimpleChanges, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationNode } from '@resource-entity/navigation.entity';
import { CyiaRepositoryService } from 'cyia-ngx-common/repository';
import { NavigationEntity } from '../../../resource-entity/navigation.entity';
import { map } from 'rxjs/operators';
import { StoreService } from '../../../store/store.service';
import { selectLeftSideNav } from '@project-store';
import { NavigationStore } from '../../../store/class/navigation.store';
@Component({
  selector: 'left-sidenav-menu',
  template: ` <aio-nav-item *ngFor="let node of nodes | async" [node]="node" [selectedNode]="selectedNode" [isWide]="isWide">
  </aio-nav-item>`,
  styleUrls: ['./nav-menu.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftSidenavMenuComponent implements OnChanges {
  @Input() selectedNode: NavigationNode;
  @Input() isWide = true;
  nodes = this.storeService.select(NavigationStore).pipe(selectLeftSideNav);
  // get filteredNodes() {
  //   return this.nodes ? this.nodes.filter((n) => !n.hidden) : [];
  // }
  pathChange: Subscription;
  constructor( private storeService: StoreService) {}
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
