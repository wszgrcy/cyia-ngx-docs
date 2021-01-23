import { GenerateDocConfig } from '../define/generate-doc-config';
/** 读取的一些配置 */
export function configServiceFactory(config: GenerateDocConfig) {
  return function configService() {
    return new ConfigService(config);
  };
}
export class ConfigService {
  constructor(public config: GenerateDocConfig) {}
}
