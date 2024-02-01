import { TestBed } from '@angular/core/testing';

import { ArtbaseService } from './artbase.service';

describe('ArtbaseService', () => {
  let service: ArtbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
