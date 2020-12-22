import { Injectable } from '@angular/core';
import { CyiaMonacoTextmateService } from 'cyia-ngx-common/monaco-textmate';
import * as monaco from 'monaco-editor';
@Injectable({
  providedIn: 'root',
})
export class MonacoService {
  waitInit: Promise<void>;

  constructor(private service: CyiaMonacoTextmateService) {
    this.waitInit = this.init();
  }
  private async init() {
    this.service.setMonaco(monaco);
    await this.service.init();
    const themeList = await this.service.getThemeList();
    const theme = await this.service.defineTheme(themeList[1]);
    monaco.editor.setTheme(theme);
  }
  registerLanguage(languageId: string) {
    return this.service.manualRegisterLanguage(languageId);
  }
  getLanguageId(str: string) {
    return this.service.getLanguageId(str);
  }
}
