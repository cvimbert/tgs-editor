import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceStepDisplayComponent } from './sequence-step-display.component';

describe('SequenceStepDisplayComponent', () => {
  let component: SequenceStepDisplayComponent;
  let fixture: ComponentFixture<SequenceStepDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceStepDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceStepDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
