import { inputText } from 'cyia-code-util';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Dgeni } from 'dgeni';
import { mainPackageFactory } from './script/main-package';
import { toDisplay } from './example-handle/to-display';
import { ExampleCodeHandle } from './example-handle/to-get-code';
import { AngularJsonConfig } from './utils/angular-json-config';
import { GenerateDocConfig } from './script/define/generate-doc-config';
export class Main {
  docConfig: {
    projectName: string;
    exampleProjectName: string;
    generateDocFileList: string[];
    packageJson: string;
    angularJson: string;
  };
  generateDocConfig: GenerateDocConfig = {};
  configPath: string;
  constructor() {}
  async run() {
    await this.getInitParameter();
    this.resolveConfig();
    const dgeni = new Dgeni([mainPackageFactory(this.generateDocConfig)]);

    dgeni.generate().then(function (docs) {
      console.log('共生成', docs.length, '份文档');
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
    configPath = path.resolve(process.cwd(), configPath);
    try {
      this.docConfig = JSON.parse(fs.readFileSync(configPath).toString());
    } catch (error) {
      console.warn('读取配置文件失败\n', error);
      throw error;
    }
    this.configPath = configPath;
  }

  resolveConfig() {
    let angularJsonPath = path.resolve(path.dirname(this.configPath), this.docConfig.angularJson);
    let angularJsonConfig = new AngularJsonConfig(JSON.parse(fs.readFileSync(angularJsonPath).toString()), path.dirname(this.configPath));
    this.generateDocConfig.tsConfigPath = angularJsonConfig
      .setCurrentProject(this.docConfig.projectName)
      .setConfiguration(undefined)
      .getTsConfig();
    this.generateDocConfig.libraryPath = angularJsonConfig.getRoot();
    this.generateDocConfig.sourcePath = angularJsonConfig.getSourceRoot();
    let packageJson = JSON.parse(fs.readFileSync(path.resolve(path.dirname(this.configPath), this.docConfig.packageJson)).toString());
    this.generateDocConfig.projectName = packageJson.name;
    this.generateDocConfig.generateDocFileList = this.docConfig.generateDocFileList;
  }
}
