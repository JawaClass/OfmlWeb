import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropclassViewerComponent } from './propclass-viewer.component';

describe('PropclassViewerComponent', () => {
  let component: PropclassViewerComponent;
  let fixture: ComponentFixture<PropclassViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropclassViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropclassViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
