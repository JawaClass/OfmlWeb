import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropSummaryComponent } from './prop-summary.component';

describe('PropSummaryComponent', () => {
  let component: PropSummaryComponent;
  let fixture: ComponentFixture<PropSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
