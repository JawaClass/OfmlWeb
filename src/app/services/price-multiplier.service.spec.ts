import { TestBed } from '@angular/core/testing';

import { PriceMultiplierService } from './price-multiplier.service';

describe('PriceMultiplierService', () => {
  let service: PriceMultiplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceMultiplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
