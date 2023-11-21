import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtbaseEditorComponent } from './artbase-editor.component';

describe('ArtbaseEditorComponent', () => {
  let component: ArtbaseEditorComponent;
  let fixture: ComponentFixture<ArtbaseEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtbaseEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtbaseEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
