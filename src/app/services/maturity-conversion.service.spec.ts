import { TestBed } from '@angular/core/testing';

import { MaturityConversionService } from './maturity-conversion.service';

describe('MaturityConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaturityConversionService = TestBed.get(MaturityConversionService);
    expect(service).toBeTruthy();
  });
});
