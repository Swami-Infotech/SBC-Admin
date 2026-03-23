import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbout } from './add-about';

describe('AddAbout', () => {
  let component: AddAbout;
  let fixture: ComponentFixture<AddAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAbout],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAbout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
