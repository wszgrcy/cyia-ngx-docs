import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private router: Router, private location: Location) {}

  getPlainUrl(url?: string) {
    const urlTree = this.router.parseUrl(url || this.location.path());
    urlTree.fragment = undefined;
    const list = [urlTree?.root];
    while (list.length) {
      const item = list.pop();
      item?.segments.forEach((segment) => {
        segment.parameters = {};
      });
      list.push(...Object.values(item?.children!));
    }
    urlTree.queryParams = {};
    return urlTree.toString();
  }
}
