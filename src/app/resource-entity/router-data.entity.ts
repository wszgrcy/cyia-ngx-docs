import { ClassDataSource } from 'cyia-ngx-common/repository';

@ClassDataSource({
  source: (http, injector, url: string) => {
    // console.log(url);
    const folder = url.split('/').filter((value) => value.trim());
    console.log(folder);
    if (folder.length === 1) {
      return http.get(`assets/${url}.json`);
    }
    const type = folder.pop();
    const name = folder.pop();
    return http.get(`assets/${folder.join('/')}/${name}/${name}.${type}.json`);
  },
})
export class RouterDataEntity {
  selector: string;
  content?: string;
  property?: any;
  children?: RouterDataEntity[];
}
