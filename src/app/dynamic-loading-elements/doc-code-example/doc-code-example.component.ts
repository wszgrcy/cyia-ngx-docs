import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { importScript } from 'cyia-ngx-common/util';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

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
  exampleCodeGroup = {};
  exampleShareCodeGroup = {};
  extGroup = {};
  constructor(private elementRef: ElementRef, private httpClient: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    importScript('assets/examples/scripts/main.js').then(async (result) => {
      const fn = await (window as any).cyiaNgxDocsLoadExamples;
      fn(this.exampleName, this.exampleComponentAnchorElementRef.nativeElement, this.destroy$);
    });
    this.httpClient
      .get(`assets/examples/codes/${this.exampleName}.json`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.exampleCodeGroup = res;
        for (const key in this.exampleCodeGroup) {
          if (Object.prototype.hasOwnProperty.call(this.exampleCodeGroup, key)) {
            const result = key.match(/\.([^\.]*)$/);
            this.extGroup[key] = result ? result[1] : 'txt';
          }
        }
        this.cd.markForCheck();
      });
    this.httpClient
      .get(`assets/examples/codes/share-file.json`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.exampleShareCodeGroup = res;
      });
    /**
     * 通过名字加载返回ref
     * 将组件插入返回
     * 通过名字拿到所有例子文件
     * 通过名字将例子文件发送到stackblitz
     * 通过名字将例子文件打包
     */
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  openCode(event: Event) {
    this.flag.codeOpen = !this.flag.codeOpen;
  }

  openEditor(e) {
    const form = document.createElement('form');
    for (const key in this.exampleShareCodeGroup) {
      if (Object.prototype.hasOwnProperty.call(this.exampleShareCodeGroup, key)) {
        const value = this.exampleShareCodeGroup[key];
        form.appendChild(this.createFormInput(`files[${key}]`, value));
      }
    }
    for (const key in this.exampleCodeGroup) {
      if (Object.prototype.hasOwnProperty.call(this.exampleCodeGroup, key)) {
        const value = this.exampleCodeGroup[key];
        form.appendChild(this.createFormInput(`files[src/app/example-code/${key}]`, value));
      }
    }
    form.appendChild(this.createFormInput('description', '测试'));
    form.appendChild(this.createFormInput('private', 'true'));
    form.appendChild(this.createFormInput('tags[0]', 'angular'));
    const dependencies = JSON.parse(this.exampleShareCodeGroup['package.json']).dependencies;
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
