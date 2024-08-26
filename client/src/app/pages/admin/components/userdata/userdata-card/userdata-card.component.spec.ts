import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdataCardComponent } from './userdata-card.component';

describe('UserdataCardComponent', () => {
  let component: UserdataCardComponent;
  let fixture: ComponentFixture<UserdataCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdataCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
