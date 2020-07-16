/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DynamicLoadingElementsService } from './dynamic-loading-elements.service';

describe('Service: DynamicLoadingElements', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicLoadingElementsService]
    });
  });

  it('should ...', inject([DynamicLoadingElementsService], (service: DynamicLoadingElementsService) => {
    expect(service).toBeTruthy();
  }));
});
