import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDisplayBlockComponent } from './preview-display-block.component';

describe('PreviewDisplayBlockComponent', () => {
  let component: PreviewDisplayBlockComponent;
  let fixture: ComponentFixture<PreviewDisplayBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewDisplayBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDisplayBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
