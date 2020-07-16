import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import md from 'markdown-it';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'overview-markdown',
  templateUrl: './overview-markdown.component.html',
  styleUrls: ['./overview-markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewMarkdownComponent implements OnInit {
  // set
  @Input() ngInputProperty;
  // (val) {
  //   console.log(val);
  // }
  rendererValue: SafeHtml;
  constructor(
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('变更检测');
    this.renderer()
  }

  renderer() {
    // console.log(this.tempValue);
    let mdres = md({
      html: true,
    });
    // console.log(mdres);
    // mdres.core.ruler.after('linkify', 'style-renderer', (s) => {
    //   s.tokens.forEach((token) => {
    //     if (this.mdClassMap[token.tag]) {
    //       token.attrJoin('class', this.mdClassMap[token.tag])
    //     }
    //   })
    // })
    this.rendererValue = this.domSanitizer.bypassSecurityTrustHtml(
      mdres.render(this.ngInputProperty)
    );
    // console.log(this.value, this.rendererValue);
    this.cd.markForCheck();
  }
}
