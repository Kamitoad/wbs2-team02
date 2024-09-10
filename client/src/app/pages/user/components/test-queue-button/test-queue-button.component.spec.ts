import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQueueButtonComponent } from './test-queue-button.component';

describe('TestQueueButtonComponent', () => {
  let component: TestQueueButtonComponent;
  let fixture: ComponentFixture<TestQueueButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestQueueButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestQueueButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
