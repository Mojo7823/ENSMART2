import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotClassificationComponent } from './robot-classification';

describe('RobotClassificationComponent', () => {
  let component: RobotClassificationComponent;
  let fixture: ComponentFixture<RobotClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RobotClassificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
