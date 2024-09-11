import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueButtonComponent } from './queue-button.component';

describe('TestQueueButtonComponent', () => {
  let component: QueueButtonComponent;
  let fixture: ComponentFixture<QueueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
