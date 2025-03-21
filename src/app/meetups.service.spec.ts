import { TestBed } from '@angular/core/testing';

import { MeetupsService } from './meetups.service';

describe('MeetupsService', () => {
  let service: MeetupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
