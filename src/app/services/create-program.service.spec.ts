import { TestBed } from '@angular/core/testing';

import { CreateProgramService } from './create-program.service';

describe('CreateProgramService', () => {
  let service: CreateProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
