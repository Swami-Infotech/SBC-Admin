import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usermanagement } from './usermanagement';

describe('Usermanagement', () => {
  let component: Usermanagement;
  let fixture: ComponentFixture<Usermanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usermanagement],
    }).compileComponents();

    fixture = TestBed.createComponent(Usermanagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
