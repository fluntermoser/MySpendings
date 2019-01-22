import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBookingsComponent } from './get-bookings.component';

describe('GetBookingsComponent', () => {
  let component: GetBookingsComponent;
  let fixture: ComponentFixture<GetBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
