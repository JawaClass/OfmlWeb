import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtbaseEditorAllWithSummaryComponent } from './artbase-editor-all-with-summary.component';

describe('ArtbaseEditorAllWithSummaryComponent', () => {
  let component: ArtbaseEditorAllWithSummaryComponent;
  let fixture: ComponentFixture<ArtbaseEditorAllWithSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtbaseEditorAllWithSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtbaseEditorAllWithSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
