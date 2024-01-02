import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDuplicateEditorComponent } from './article-duplicate-editor.component';

describe('ArticleDuplicateEditorComponent', () => {
  let component: ArticleDuplicateEditorComponent;
  let fixture: ComponentFixture<ArticleDuplicateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleDuplicateEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleDuplicateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
