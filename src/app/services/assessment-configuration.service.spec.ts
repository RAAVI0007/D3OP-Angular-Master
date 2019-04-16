import { TestBed } from '@angular/core/testing';

import { AssessmentConfigurationService } from './assessment-configuration.service';

describe('AssessmentConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessmentConfigurationService = TestBed.get(AssessmentConfigurationService);
    expect(service).toBeTruthy();
  });
});
