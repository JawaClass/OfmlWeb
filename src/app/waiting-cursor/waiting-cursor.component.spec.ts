import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingCursorComponent } from './waiting-cursor.component';

describe('WaitingCursorComponent', () => {
  let component: WaitingCursorComponent;
  let fixture: ComponentFixture<WaitingCursorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingCursorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WaitingCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
