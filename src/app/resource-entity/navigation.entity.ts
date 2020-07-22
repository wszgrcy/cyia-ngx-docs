import { ClassDataSource, StronglyTyped } from 'cyia-ngx-common/repository';
export class NavigationNode {
  title: string;
  url: string;
  icon: string;
  tooltip: string;
  children: NavigationNode[];
}
@ClassDataSource({
  source: (http) => {
    return http.get('assets/navigation.json');
  },
})
export class NavigationEntity {
  @StronglyTyped(NavigationNode)
  sideNav: NavigationNode[];
}