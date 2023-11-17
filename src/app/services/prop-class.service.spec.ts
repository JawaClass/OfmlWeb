import { TestBed } from '@angular/core/testing';

import { PropClassService } from './prop-class.service';

describe('PropClassService', () => {
  let service: PropClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
