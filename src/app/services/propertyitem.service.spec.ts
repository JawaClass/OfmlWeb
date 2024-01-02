import { TestBed } from '@angular/core/testing';

import { PropertyitemService } from './propertyitem.service';

describe('PropertyitemService', () => {
  let service: PropertyitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
