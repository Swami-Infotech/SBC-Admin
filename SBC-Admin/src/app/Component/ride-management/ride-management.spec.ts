import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideManagement } from './ride-management';

describe('RideManagement', () => {
  let component: RideManagement;
  let fixture: ComponentFixture<RideManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(RideManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
