import { TestBed } from '@angular/core/testing';

import { EditPasswordService } from './edit-password.service';

describe('EditUserService', () => {
  let service: EditPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
