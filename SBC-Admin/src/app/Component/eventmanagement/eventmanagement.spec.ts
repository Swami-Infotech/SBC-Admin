import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eventmanagement } from './eventmanagement';

describe('Eventmanagement', () => {
  let component: Eventmanagement;
  let fixture: ComponentFixture<Eventmanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eventmanagement],
    }).compileComponents();

    fixture = TestBed.createComponent(Eventmanagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
