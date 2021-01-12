import { inputText } from 'cyia-code-util';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Dgeni } from 'dgeni';
import docsPackage from './script/main-package';
import { toDisplay } from './example-handle/to-display';
import { ExampleCodeHandle } from './example-handle/to-get-code';
export class Main {
  docConfig: {
    projectName: string;
    exampleProjectName: string;
    generateDocFileList: string[];
    packageJson: string;
  };
  constructor() {}
  async run() {
    await this.getInitParameter();

    const dgeni = new Dgeni([docsPackage]);

    dgeni.generate().then(function (docs) {
      console.log('文档生成完成', docs.length);
    });
    toDisplay();
    new ExampleCodeHandle({ projectName: this.docConfig.exampleProjectName }).build();
  }

  async getInitParameter() {
    let configPath = await inputText('请输入文档配置文件', (input) => {
      const configPath = path.resolve(process.cwd(), input);
      const exist = fs.existsSync(configPath);
      if (!exist) {
        console.warn(`\n文件路径[${configPath}]不存在`);
        return false;
      }
      const stat = fs.statSync(configPath);
      if (!stat.isFile()) {
        console.warn(`\n该路径[${configPath}]并不是一个文件`);
        return false;
      }
      return true;
    });
    console.log(configPath);
    configPath = path.resolve(process.cwd(), configPath);
    try {
      this.docConfig = JSON.parse(fs.readFileSync(configPath).toString());
    } catch (error) {
      console.warn('读取配置文件失败\n', error);
      throw error;
    }
    console.log(this.docConfig);
  }

  resolveConfig() {

  }
}
