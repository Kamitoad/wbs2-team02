import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPasswordProfilepicComponent } from './edit-password-profilepic.component';

describe('PasswordChangeComponent', () => {
  let component: EditPasswordProfilepicComponent;
  let fixture: ComponentFixture<EditPasswordProfilepicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPasswordProfilepicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPasswordProfilepicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
