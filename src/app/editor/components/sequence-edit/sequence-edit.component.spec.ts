import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceEditComponent } from './sequence-edit.component';

describe('SequenceEditComponent', () => {
  let component: SequenceEditComponent;
  let fixture: ComponentFixture<SequenceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
