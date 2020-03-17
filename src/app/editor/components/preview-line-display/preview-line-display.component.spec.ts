import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLineDisplayComponent } from './preview-line-display.component';

describe('PreviewLineDisplayComponent', () => {
  let component: PreviewLineDisplayComponent;
  let fixture: ComponentFixture<PreviewLineDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLineDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLineDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
