import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeArticleAsAliasComponent } from './merge-article-as-alias.component';

describe('MergeArticleAsAliasComponent', () => {
  let component: MergeArticleAsAliasComponent;
  let fixture: ComponentFixture<MergeArticleAsAliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeArticleAsAliasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MergeArticleAsAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
