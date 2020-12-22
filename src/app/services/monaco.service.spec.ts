/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MonacoService } from './monaco.service';

describe('Service: Monaco', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonacoService]
    });
  });

  it('should ...', inject([MonacoService], (service: MonacoService) => {
    expect(service).toBeTruthy();
  }));
});
