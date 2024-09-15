import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRightComponent } from './playerRight.component';

describe('PlayerComponent', () => {
  let component: PlayerRightComponent;
  let fixture: ComponentFixture<PlayerRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
