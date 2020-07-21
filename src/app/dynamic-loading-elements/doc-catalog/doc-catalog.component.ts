import {
  Component,
  OnInit,
  Input,
  ElementRef,
  Inject,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { debounceTime, filter, take, map } from 'rxjs/operators';
import { Renderer2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectDocRenderer } from '../../selector/doc-renderer.selector';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTree,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

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
export class DocCatalogComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    /**组件的元素引用 */
    private elementRef: ElementRef,
    // private _navigationFocusService: NavigationFocusService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {
    this.url = this.router.url.replace(/#.*/, '');
    this.hostElement = elementRef.nativeElement;
    this.subscriptions.add(
      this.router.events
        .pipe(
          filter(
            (event: Event): event is NavigationEnd =>
              event instanceof NavigationEnd
          )
        )
        .subscribe(() => {
          const rootUrl = router.url.split('#')[0];
          if (rootUrl !== this._rootUrl) {
            this._rootUrl = rootUrl;
          }
        })
    );

    this.subscriptions.add(
      this.activatedRoute.fragment.subscribe((fragment) => {
        this._urlFragment = fragment;

        const target = document.getElementById(this._urlFragment);
        if (target) {
          target.scrollIntoView();
        }
      })
    );
  }
  @ViewChild(MatTree, { static: true }) matTree: MatTree<CatalogTree>;
  url: string;
  catalogList: CatalogTree[];
  scrollContainer: HTMLElement;
  headersElement: NodeListOf<HTMLHeadingElement>;
  rootNode: CatalogTree;
  map = new Map();

  @Input() ngInputProperty: {
    /**文档选择器 */
    selector: string;
  };

  /**
   * doc 等待初始化信号进行初始化目录
   * doc 初始化后判断位置
   * 监听容器滚动变更位置
   */
  // /**滚动容器的选择器 */
  // @Input() container: string;
  /**文档的元素 */
  docElement: HTMLElement;
  // _links: Link[] = [];
  /**当前路由的地址 */
  _rootUrl = this.router.url.split('#')[0];
  /**滚动容器 */
  // private _scrollContainer: any;
  /**id */
  private _urlFragment = '';
  private subscriptions = new Subscription();
  hostElement: HTMLElement;

  treeControl = new FlatTreeControl<CatalogTree>(
    (node) => node.level,
    (node) => true
  );

  private transformer = (() => {
    return (node: CatalogTree, level: number) => {
      if (this.map.has(node)) {
        const treenode = this.map.get(node);
        treenode.active = node.active;
        // console.log(this.map.get(node));
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
  ngOnInit(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    this.store
      .pipe(
        select(selectDocRenderer, this.router.url),
        filter(Boolean),
        take(1)
      )
      .subscribe(() => {
        const el: HTMLElement = document.querySelector(
          this.ngInputProperty.selector
        );
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

  // ngAfterViewInit() {
  //   this.updateScrollPosition();
  // }

  ngOnChanges(changes: SimpleChanges): void {
    // this.updateScrollPosition();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  updateScrollPosition(): void {
    fromEvent(this.scrollContainer, 'scroll')
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
    const headers: NodeListOf<HTMLHeadingElement> = this.docElement.querySelectorAll(
      'h1[id],h2[id],h3[id],h4[id],h5[id],h6[id],h1,h2,h3,h4,h5,h6'
    );

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

  /**恢复位置 */
  restorePosition(selector: string) {

    this.docElement.querySelector(selector).scrollIntoView();
  }

  hasChild = (_: number, node: CatalogTree) => node.expandable;
}
