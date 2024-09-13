import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerLeftComponent } from './playerLeft.component';

describe('PlayerComponent', () => {
  let component: PlayerLeftComponent;
  let fixture: ComponentFixture<PlayerLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
