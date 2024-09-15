import { TestBed } from '@angular/core/testing';

import { EditProfilePicService } from './edit-profile-pic.service';

describe('EditProfilePicService', () => {
  let service: EditProfilePicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditProfilePicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
