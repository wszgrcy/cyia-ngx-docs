import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { importScript, importStyle } from 'cyia-ngx-common/util';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take, map, tap } from 'rxjs/operators';

@Component({
  selector: 'doc-code-example',
  templateUrl: './doc-code-example.component.html',
  styleUrls: ['./doc-code-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocCodeExampleComponent implements OnInit {
  @Input() exampleName: string;
  @Input() exampleTitle: string;
  @ViewChild('exampleComponentAnchor', { static: true }) exampleComponentAnchorElementRef: ElementRef<any>;
  destroy$ = new Subject();
  flag = {
    codeOpen: false,
  };
  extGroup = {};
  exampleCodeGroupPromise: Promise<{ [name: string]: string }>;
  exampleShareCodeGroupPromise: Promise<{ [name: string]: string }>;
  exampleCodeActionGroup: { insert?: { filePath: string; content: string; position: number }[] } = {};
  constructor(private elementRef: ElementRef, private httpClient: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.httpClient
      .get('assets/examples/scripts/bootstrap.json')
      .subscribe((item: { scripts: { src: string }[]; stylesheets: { href: string }[] }) => {
        Promise.all([
          Promise.all(item.scripts.map(({ src }) => importScript(`assets/examples/scripts/${src}`))),
          //todo 升级修改
          Promise.all(item.stylesheets.map(({ href }) => importStyle(`assets/examples/scripts/${href}`))),
        ]).then(async () => {
          const fn = await (window as any).cyiaNgxDocsLoadExamples;
          if (!fn) {
            throw new Error('未找到全局的实例载入函数cyiaNgxDocsLoadExamples');
          }
          fn(this.exampleName, this.exampleComponentAnchorElementRef.nativeElement, this.destroy$);
        });
      });

    this.exampleCodeGroupPromise = this.httpClient
      .get(`assets/examples/codes/${this.exampleName}.json`)
      .pipe(
        take(1),
        tap((res: any) => (this.exampleCodeActionGroup = res.action)),
        map((res: any) => {
          res = res.file;
          for (const key in res) {
            if (Object.prototype.hasOwnProperty.call(res, key)) {
              const result = key.match(/\.([^\.]*)$/);
              this.extGroup[key] = result ? result[1] : 'txt';
            }
          }
          this.cd.markForCheck();
          return res;
        })
      )
      .toPromise();

    this.exampleShareCodeGroupPromise = this.httpClient
      .get(`assets/examples/codes/share-file.json`)
      .pipe(
        take(1),
        map((res: any) => {
          return res;
        })
      )
      .toPromise();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  openCode(event: Event) {
    this.flag.codeOpen = !this.flag.codeOpen;
  }

  async openEditor(e) {
    const exampleCodeGroup = await this.exampleCodeGroupPromise;
    const exampleShareCodeGroup = await this.exampleShareCodeGroupPromise;
    (this.exampleCodeActionGroup.insert || []).forEach((item) => {
      exampleShareCodeGroup[item.filePath] =
        exampleShareCodeGroup[item.filePath].slice(0, item.position) +
        item.content +
        exampleShareCodeGroup[item.filePath].slice(item.position);
    });
    const form = document.createElement('form');
    for (const key in exampleShareCodeGroup) {
      if (Object.prototype.hasOwnProperty.call(exampleShareCodeGroup, key)) {
        const value = exampleShareCodeGroup[key];
        form.appendChild(this.createFormInput(`files[${key}]`, value));
      }
    }
    for (const key in exampleCodeGroup) {
      if (Object.prototype.hasOwnProperty.call(exampleCodeGroup, key)) {
        const value = exampleCodeGroup[key];
        form.appendChild(this.createFormInput(`files[src/app/${this.exampleName}/${key}]`, value));
      }
    }
    const packageJson = JSON.parse(exampleShareCodeGroup['package.json']);

    form.appendChild(this.createFormInput('description', packageJson.description || packageJson.name || ''));
    form.appendChild(this.createFormInput('tags[0]', 'angular'));
    const dependencies = packageJson.dependencies;
    form.appendChild(this.createFormInput('dependencies', JSON.stringify(dependencies)));
    document.body.appendChild(form);
    form.target = '_blank';
    form.method = 'post';
    form.action = `https://run.stackblitz.com/api/angular/v1`;
    form.submit();
    document.body.removeChild(form);
  }
  createFormInput(key, value) {
    const input = document.createElement('textarea');
    input.name = key;
    input.value = value;
    input.hidden = true;
    return input;
  }
}
