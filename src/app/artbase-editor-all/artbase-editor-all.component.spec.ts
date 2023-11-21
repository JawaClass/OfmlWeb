import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtbaseEditorAllComponent } from './artbase-editor-all.component';

describe('ArtbaseEditorAllComponent', () => {
  let component: ArtbaseEditorAllComponent;
  let fixture: ComponentFixture<ArtbaseEditorAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtbaseEditorAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtbaseEditorAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
