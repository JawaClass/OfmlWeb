import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeArticleComponent } from './merge-article.component';

describe('MergeArticleComponent', () => {
  let component: MergeArticleComponent;
  let fixture: ComponentFixture<MergeArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MergeArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
