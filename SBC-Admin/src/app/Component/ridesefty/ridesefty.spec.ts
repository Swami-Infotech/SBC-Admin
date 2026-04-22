import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ridesefty } from './ridesefty';

describe('Ridesefty', () => {
  let component: Ridesefty;
  let fixture: ComponentFixture<Ridesefty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ridesefty],
    }).compileComponents();

    fixture = TestBed.createComponent(Ridesefty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
