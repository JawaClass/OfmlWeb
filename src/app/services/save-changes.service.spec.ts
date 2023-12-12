import { TestBed } from '@angular/core/testing';

import { SaveChangesService } from './save-changes.service';

describe('SaveChangesService', () => {
  let service: SaveChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
