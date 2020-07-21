import { ClassDataSource } from 'cyia-ngx-common/repository';

@ClassDataSource({
  source: (http, injector, url: string) => {
    const folder = url.split('/').filter((value) => value.trim());
    console.log('文件夹', folder);
    console.log(`assets${url}.${folder[0]}.json`);
    return http.get(`assets${url}.${folder[0]}.json`);
  },
})
export class RouterDataEntity {
  selector: string;
  content?: string;
  property?: any;
  children?: RouterDataEntity[];
}
