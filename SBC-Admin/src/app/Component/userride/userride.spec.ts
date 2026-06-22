import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Userride } from './userride';

describe('Userride', () => {
  let component: Userride;
  let fixture: ComponentFixture<Userride>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userride],
    }).compileComponents();

    fixture = TestBed.createComponent(Userride);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
