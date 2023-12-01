import { TestBed } from '@angular/core/testing';

import { ArtbaseEditorService } from './artbase-editor.service';

describe('ArtbaseEditorService', () => {
  let service: ArtbaseEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtbaseEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
