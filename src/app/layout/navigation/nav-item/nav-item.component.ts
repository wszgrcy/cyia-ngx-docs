import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { NavigationNode } from '@resource-entity/navigation.entity';
@Component({
  selector: 'aio-nav-item',
  templateUrl: 'nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
})
export class NavItemComponent implements OnChanges {
  @Input() isWide = true;
  /**
   * doc 可以不需要
   */
  // @Input() level = 1;
  @Input() node: NavigationNode;
  @Input() isParentExpanded = true;
  @Input() selectedNode: NavigationNode;
  @Output() childSelected: EventEmitter<void> = new EventEmitter(true);
  isExpanded = false;
  isSelected = false;
  classes: {
    selected?: boolean;
    collapsed?: boolean;
    expanded?: boolean;
  } = {};
  nodeChildren: NavigationNode[];

  ngOnChanges(changes: SimpleChanges) {
    this.nodeChildren = (this.node && this.node.children) || [];

    if (changes.selectedNode && this.selectedNode) {
      // console.log('节点判断', this.node, this.selectedNode)
      if (this.selectedNode.url == this.node.url) {
        // console.log('节点应该选中', this.node);
        this.isSelected = true;
        this.emitSelected();
      } else {
        this.isSelected = false;
        // this.isExpanded = false
      }
    }
    // console.log('设置值', this.isSelected)
    this.setClasses();
  }

  setClasses() {
    this.classes = {
      // ['level-' + this.level]: true,
      collapsed: !this.isExpanded,
      expanded: this.isExpanded,
      selected: this.isSelected,
    };
  }

  /**
   * 箭头点击
   *
   * @author cyia
   * @date 2019-09-25
   */
  headerClicked() {
    this.isExpanded = !this.isExpanded;
    this.setClasses();
  }
  emitSelected() {
    // !this.childSelected && (this.childSelected = new EventEmitter())
    this.childSelected.emit();
  }
  onEmitSelected() {
    // console.log('收到事件', this.node)
    this.isSelected = true;
    this.isExpanded = true;
    this.setClasses();
    this.emitSelected();
  }
}
