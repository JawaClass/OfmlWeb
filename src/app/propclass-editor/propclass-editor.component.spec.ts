import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropclassEditorComponent } from './propclass-editor.component';

describe('PropclassEditorComponent', () => {
  let component: PropclassEditorComponent;
  let fixture: ComponentFixture<PropclassEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropclassEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropclassEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
