import { TestBed } from '@angular/core/testing';

import { PracticeScoreService } from './practice-score.service';

describe('PracticeScoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PracticeScoreService = TestBed.get(PracticeScoreService);
    expect(service).toBeTruthy();
  });
});
