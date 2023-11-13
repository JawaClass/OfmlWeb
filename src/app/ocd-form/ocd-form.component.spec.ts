import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcdFormComponent } from './ocd-form.component';

describe('OcdFormComponent', () => {
  let component: OcdFormComponent;
  let fixture: ComponentFixture<OcdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcdFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OcdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
