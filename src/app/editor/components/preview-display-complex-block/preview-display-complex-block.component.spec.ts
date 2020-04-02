import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDisplayComplexBlockComponent } from './preview-display-complex-block.component';

describe('PreviewDisplayComplexBlockComponent', () => {
  let component: PreviewDisplayComplexBlockComponent;
  let fixture: ComponentFixture<PreviewDisplayComplexBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewDisplayComplexBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDisplayComplexBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
