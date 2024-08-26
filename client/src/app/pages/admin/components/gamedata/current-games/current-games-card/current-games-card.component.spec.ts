import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentGamesCardComponent } from './current-games-card.component';

describe('CurrentGamesCardComponent', () => {
  let component: CurrentGamesCardComponent;
  let fixture: ComponentFixture<CurrentGamesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentGamesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentGamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
