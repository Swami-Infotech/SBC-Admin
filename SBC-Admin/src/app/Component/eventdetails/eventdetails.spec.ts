import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eventdetails } from './eventdetails';

describe('Eventdetails', () => {
  let component: Eventdetails;
  let fixture: ComponentFixture<Eventdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eventdetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Eventdetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
