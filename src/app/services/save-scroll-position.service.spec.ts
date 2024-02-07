import { TestBed } from '@angular/core/testing';

import { SaveScrollPositionService } from './save-scroll-position.service';

describe('SaveScrollPositionService', () => {
  let service: SaveScrollPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveScrollPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
