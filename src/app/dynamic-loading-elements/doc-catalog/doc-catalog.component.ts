import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Inject,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { Subscription, fromEvent, Subject, merge } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { debounceTime, filter, take, map } from 'rxjs/operators';
import { Renderer2, OnChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { StoreService } from '../../store/store.service';
import { DocRendererStore } from '../../store/class/doc-renderer.store';
import { selectDocRenderer } from '@project-store';
import { CatalogStore } from '../../store/class/catalog.store';
import { RouterService } from '../../services/router.service';
import { inputPropertyChange } from '../../utils/input-property-change';
import { ElementInputPropertyStore } from '../../store/class/element-input.store';
import { elementInputPropertySelector } from '../../store/selector/element-input.selector';
/**目录树节点 */
class CatalogTree {
  level: number = 0;
  parent?: CatalogTree;
  children?: CatalogTree[] = [];
  name: string;
  active?: boolean;
  expandable?: boolean;
}

@Component({
  selector: 'doc-catalog',
  templateUrl: './doc-catalog.component.html',
  styleUrls: ['./doc-catalog.component.scss'],
})
export class DocCatalogComponent implements OnInit, OnChanges, OnDestroy {
  @Input() index;
  linkClick$ = new Subject();
  /**
   * todo 视区高度获取
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private storeService: StoreService,
    private routerService: RouterService
  ) {
    this.url = this.routerService.getPlainUrl();
    this.storeService.getStore(CatalogStore).INIT({ value: this });
    this.activatedRoute.fragment.pipe(filter(() => !!this.docElement)).subscribe((fragment) => {
      const target = this.docElement.querySelector(`#${fragment}`);
      if (target) {
        target.scrollIntoView();
        this.linkClick$.next();
      }
    });
  }
  @ViewChild(MatTree, { static: true }) matTree: MatTree<CatalogTree>;
  url: string;
  catalogList: CatalogTree[];
  /** 滚动的容器 */
  scrollContainer: HTMLElement;
  headersElement: NodeListOf<HTMLHeadingElement>;
  rootNode: CatalogTree;
  map = new Map();

  /**文档选择器 */
  @Input() selector: string;
  /**文档的元素 */
  docElement: HTMLElement;

  treeControl = new FlatTreeControl<CatalogTree>(
    (node) => node.level,
    (node) => true
  );

  private transformer = (() => {
    return (node: CatalogTree, level: number) => {
      if (this.map.has(node)) {
        const treenode = this.map.get(node);
        treenode.active = node.active;
        return treenode;
      }
      const treenode = {
        expandable: !!node.children && node.children.length > 0,
        name: node.name,
        level,
        active: node.active,
      };
      this.map.set(node, treenode);
      return treenode;
    };
  })();

  private treeFlattener = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => true,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  @HostBinding('style.display') display = 'block';
  ngOnInit(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    this.storeService
      .select(DocRendererStore)
      .pipe(selectDocRenderer, filter(Boolean), take(1))
      .subscribe(() => {
        const el: HTMLElement = document.querySelector(this.selector);
        // todo 设置滚动容器,这个耦合性较高
        this.scrollContainer = document.querySelector('.scroll-container');
        this.docElement = el;

        if (urlTree.fragment) {
          this.restorePosition('#' + urlTree.fragment);
        }
        this.initHeaders();
        this.updateScrollPosition();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (inputPropertyChange(changes.index, this.index)) {
      this.storeService
        .select(ElementInputPropertyStore)
        .pipe(elementInputPropertySelector(this.index))
        .subscribe((property) => {
          this.selector = property.selector;
        });
    }
  }
  ngOnDestroy(): void {}
  /** 订阅滚动更新位置 */
  updateScrollPosition(): void {
    merge(fromEvent(this.scrollContainer, 'scroll'), this.linkClick$)
      .pipe(debounceTime(50))
      .subscribe((e) => {
        for (let i = 0; i < this.headersElement.length; i++) {
          const { top } = this.headersElement[i].getBoundingClientRect();
          if (top >= 64) {
            this.catalogList.forEach((item, j) => {
              item.active = i === j ? true : false;
            });
            break;
          }
        }

        this.dataSource.data = this.dataSource.data;
        this.cd.detectChanges();
      });
  }

  /**
   * 初始化头列表
   * 生成树及列表
   * @author cyia
   * @date 2020-07-21
   */
  initHeaders() {
    const headers: NodeListOf<HTMLHeadingElement> = this.docElement.querySelectorAll('h1,h2,h3,h4,h5,h6');
    // console.log('初始化头', headers);
    this.headersElement = headers;
    const links: CatalogTree[] = [];
    let node = new CatalogTree();
    const root = node;
    this.rootNode = node;
    let hasActive = false;

    headers.forEach((header) => {
      const { top } = header.getBoundingClientRect();
      let active: boolean = false;
      // todo 获取相关高度计算
      if (!hasActive && top >= 64) {
        active = true;
        hasActive = true;
      }
      const tag = header.tagName.toLowerCase();
      let current = node;
      const name = header.innerText.trim();
      while (current) {
        const level = +tag.substr(1);
        if (level <= current.level) {
          current = current.parent;
        } else {
          node = {
            level,
            parent: current,
            children: [],
            name,
            active,
          };
          links.push(node);
          current.children.push(node);
          break;
        }
      }
    });
    this.catalogList = links;
    this.dataSource.data = root.children;
    this.treeControl.expandAll();
  }

  /** 恢复位置 */
  restorePosition(selector: string) {
    this.docElement.querySelector(selector).scrollIntoView();
  }

  hasChild = (_: number, node: CatalogTree) => node.expandable;
  open() {
    console.log('打开');
    this.display = 'block';
  }
  close() {
    console.log('关闭');
    this.display = 'none';
  }
}
