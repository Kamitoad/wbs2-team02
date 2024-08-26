import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueOverviewCardComponent } from './queue-overview-card.component';

describe('QueueOverviewCardComponent', () => {
  let component: QueueOverviewCardComponent;
  let fixture: ComponentFixture<QueueOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueOverviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
