import { ClassDataSource } from 'cyia-ngx-common/repository';

@ClassDataSource({
  source: (http, injector, url: string) => {
    // console.log(url);
    const folder = url.split('/').filter((value) => value.trim());
    const type = folder.pop();
    const name = folder.pop();
    // console.log('文件夹', folder);
    // console.log(`assets${url}.${folder[0]}.json`);
    return http.get(`assets/${folder.join('/')}/${name}/${name}.${type}.json`);
  },
})
export class RouterDataEntity {
  selector: string;
  content?: string;
  property?: any;
  children?: RouterDataEntity[];
}
