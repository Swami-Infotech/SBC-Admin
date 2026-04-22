import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRide } from './user-ride';

describe('UserRide', () => {
  let component: UserRide;
  let fixture: ComponentFixture<UserRide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRide],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
