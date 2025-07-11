import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSelection } from './assessment-selection';

describe('AssessmentSelection', () => {
  let component: AssessmentSelection;
  let fixture: ComponentFixture<AssessmentSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
