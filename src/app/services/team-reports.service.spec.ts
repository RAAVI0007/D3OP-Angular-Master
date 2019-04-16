import { TestBed } from '@angular/core/testing';

import { TeamReportsService } from './team-reports.service';

describe('TeamReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamReportsService = TestBed.get(TeamReportsService);
    expect(service).toBeTruthy();
  });
});
