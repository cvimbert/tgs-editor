import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDisplayComponent } from './preview-display.component';

describe('PreviewDisplayComponent', () => {
  let component: PreviewDisplayComponent;
  let fixture: ComponentFixture<PreviewDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
