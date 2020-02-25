import { TestBed } from '@angular/core/testing';

import { FilesManagerService } from './files-manager.service';

describe('FilesManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilesManagerService = TestBed.get(FilesManagerService);
    expect(service).toBeTruthy();
  });
});
