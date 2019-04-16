import { TestBed } from '@angular/core/testing';

import { ProductReportsService } from './product-reports.service';

describe('ProductReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductReportsService = TestBed.get(ProductReportsService);
    expect(service).toBeTruthy();
  });
});
