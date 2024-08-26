import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamedataComponent } from './gamedata.component';

describe('GamedataComponent', () => {
  let component: GamedataComponent;
  let fixture: ComponentFixture<GamedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamedataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
