import { TestBed } from '@angular/core/testing';

import { SBC } from './sbc';

describe('SBC', () => {
  let service: SBC;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SBC);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
