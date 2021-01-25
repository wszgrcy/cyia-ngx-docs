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
  private docConfig: {
    projectName: string;
    exampleProjectName: string;
    generateDocFileList: string[];
    packageJson: string;
    angularJson: string;
    exampleScript: string;
    exampleCode: string;
  };
  private generateDocConfig: GenerateDocConfig = {};
  /** 生成文档的配置文件 */
  private configPath: string;
  constructor() {}
  async run() {
    await this.getInitParameter();
    this.resolveConfig();
    const dgeni = new Dgeni([mainPackageFactory(this.generateDocConfig)]);

    dgeni.generate().then(function (docs) {
      console.log('共生成', docs.length, '份文档');
    });
    toDisplay(path.resolve(path.dirname(this.configPath), this.docConfig.exampleScript));
    new ExampleCodeHandle({
      projectName: this.docConfig.exampleProjectName,
      exampleCodePath: path.resolve(path.dirname(this.configPath), this.docConfig.exampleCode),
    }).run();
  }

  private async getInitParameter() {
    let configPath: string;
    if (fs.statSync(path.resolve(process.cwd(), process.argv[2])).isDirectory()) {
      configPath = path.join(process.argv[2], 'cyia-ngx-docs.json');
    }
    if (configPath && this.validConfigPath(configPath)) {
    } else {
      configPath = await inputText('请输入文档配置文件', (input) => {
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
    }
    configPath = path.resolve(process.cwd(), configPath);
    try {
      this.docConfig = JSON.parse(fs.readFileSync(configPath).toString());
    } catch (error) {
      console.warn('读取配置文件失败\n', error);
      throw error;
    }
    this.configPath = configPath;
  }

  private resolveConfig() {
    const angularJsonPath = path.resolve(path.dirname(this.configPath), this.docConfig.angularJson);
    const angularJsonConfig = new AngularJsonConfig(JSON.parse(fs.readFileSync(angularJsonPath).toString()), path.dirname(this.configPath));
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(path.dirname(this.configPath), this.docConfig.packageJson)).toString());
    this.generateDocConfig = {
      tsConfigPath: angularJsonConfig.setCurrentProject(this.docConfig.projectName).setConfiguration(undefined).getTsConfig(),
      libraryPath: angularJsonConfig.getRoot(),
      sourcePath: angularJsonConfig.getSourceRoot(),
      projectName: packageJson.name,
      generateDocFileList: this.docConfig.generateDocFileList,
      angularJsonConfig,
    };
  }

  private validConfigPath(filePath: string) {
    const configPath = path.resolve(process.cwd(), filePath);
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
  }
}
