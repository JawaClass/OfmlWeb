import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Artbase4proplassComponent } from './artbase4proplass.component';

describe('Artbase4proplassComponent', () => {
  let component: Artbase4proplassComponent;
  let fixture: ComponentFixture<Artbase4proplassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artbase4proplassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Artbase4proplassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
