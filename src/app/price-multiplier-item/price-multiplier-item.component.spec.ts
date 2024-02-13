import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceMultiplierItemComponent } from './price-multiplier-item.component';

describe('PriceMultiplierItemComponent', () => {
  let component: PriceMultiplierItemComponent;
  let fixture: ComponentFixture<PriceMultiplierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceMultiplierItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceMultiplierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
