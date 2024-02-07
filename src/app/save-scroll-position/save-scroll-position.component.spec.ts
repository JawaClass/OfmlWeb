import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveScrollPositionComponent } from './save-scroll-position.component';

describe('SaveScrollPositionComponent', () => {
  let component: SaveScrollPositionComponent;
  let fixture: ComponentFixture<SaveScrollPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveScrollPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveScrollPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
