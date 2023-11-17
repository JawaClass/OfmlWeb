import { TestBed } from '@angular/core/testing';

import { ArticleInputService } from './article-input.service';

describe('ArticleInputService', () => {
  let service: ArticleInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
