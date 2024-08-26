import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueOverviewComponent } from './queue-overview.component';

describe('QueueOverviewComponent', () => {
  let component: QueueOverviewComponent;
  let fixture: ComponentFixture<QueueOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
