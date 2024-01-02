import { TestBed } from '@angular/core/testing';

import { ArticleitemService } from './articleitem.service';

describe('ArticleitemService', () => {
  let service: ArticleitemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleitemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
