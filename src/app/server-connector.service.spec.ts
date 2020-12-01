import { TestBed } from '@angular/core/testing';

import { ServerConnectorService } from './server-connector.service';

describe('ServerConnectorService', () => {
  let service: ServerConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
