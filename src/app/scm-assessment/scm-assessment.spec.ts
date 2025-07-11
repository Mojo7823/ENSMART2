import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmAssessment } from './scm-assessment';

describe('ScmAssessment', () => {
  let component: ScmAssessment;
  let fixture: ComponentFixture<ScmAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScmAssessment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScmAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
