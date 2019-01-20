import { TestBed } from '@angular/core/testing';

import { WebinterfaceService } from './webinterface.service';

describe('WebinterfaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebinterfaceService = TestBed.get(WebinterfaceService);
    expect(service).toBeTruthy();
  });
});
