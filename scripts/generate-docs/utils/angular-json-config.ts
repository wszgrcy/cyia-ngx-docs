import { WorkspaceTargets, WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import * as path from 'path';
export class AngularJsonConfig {
  project: WorkspaceProject;
  configuration: string;
  constructor(private config: WorkspaceSchema, private configDir: string) {}

  setCurrentProject(projectName: string) {
    this.project = this.config.projects[projectName];
    return this;
  }
  setConfiguration(configuration: string) {
    this.configuration = configuration;
    return this;
  }
  // todo 目前文档生成只支持library,而library又只有build,所以其他选项无意义,没必要提供其他architect选择
  //   setArchitect(architect: string) {
  //     this.architect = architect;
  //     return this;
  //   }
  getIndex() {
    let index =
      typeof this.getCurrentOptions().index === 'string' ? this.getCurrentOptions().index : (this.getCurrentOptions().index as any).input;
    return path.resolve(this.configDir, index);
  }
  getTsConfig() {
    return path.resolve(this.configDir, this.getCurrentOptions().tsConfig);
  }
  getRoot() {
    return path.resolve(this.configDir, this.project.root);
  }
  getSourceRoot() {
    return path.resolve(this.configDir, this.project.sourceRoot);
  }
  getCurrentProject() {
    return this.project;
  }
  private getCurrentOptions() {
    return this.configuration
      ? { ...this.project.architect.build.options, ...this.project.architect.build.configurations[this.configuration] }
      : this.project.architect.build.options;
  }
}
