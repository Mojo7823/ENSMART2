import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { RobotService } from '../robot';

export interface SCMAssessmentData {
  question1: 'yes' | 'no' | null;
  question2: 'yes' | 'no' | null;
  question3: 'yes' | 'no' | null;
  outcome: 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | null;
  documentation: string;
  completedAt: Date;
}

@Component({
  selector: 'app-scm-assessment',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './scm-assessment.html',
  styleUrl: './scm-assessment.css'
})
export class ScmAssessment implements OnInit {
  assessment: SCMAssessmentData = {
    question1: null,
    question2: null,
    question3: null,
    outcome: null,
    documentation: '',
    completedAt: new Date()
  };

  showQuestion2 = false;
  showQuestion3 = false;
  showOutcome = false;

  constructor(
    private router: Router,
    private robotService: RobotService
  ) {}

  ngOnInit(): void {
    // Load existing assessment data if it exists
    const robotData = this.robotService.getRobotData();
    if (robotData.assessments?.scm1) {
      this.assessment = { ...robotData.assessments.scm1 };
      this.updateFormState();
    }
  }

  private updateFormState(): void {
    // Update form state based on assessment data
    if (this.assessment.question1 === 'no') {
      this.showQuestion2 = true;
      if (this.assessment.question2 === 'no') {
        this.showQuestion3 = true;
        if (this.assessment.question3 !== null) {
          this.showOutcome = true;
        }
      } else if (this.assessment.question2 === 'yes') {
        this.showOutcome = true;
      }
    } else if (this.assessment.question1 === 'yes') {
      this.showOutcome = true;
    }
  }

  onQuestion1Change(): void {
    this.showQuestion2 = this.assessment.question1 === 'no';
    this.showQuestion3 = false;
    this.showOutcome = false;
    this.assessment.question2 = null;
    this.assessment.question3 = null;
    this.assessment.outcome = null;
    this.assessment.documentation = '';

    if (this.assessment.question1 === 'yes') {
      this.assessment.outcome = 'PASS';
      this.assessment.documentation = 'Vendor must describe the secure communication mechanism that is used, including communication protocols, equipment states, security goals, and connection establishment details.';
      this.showOutcome = true;
    }
  }

  onQuestion2Change(): void {
    this.showQuestion3 = this.assessment.question2 === 'no';
    this.showOutcome = false;
    this.assessment.question3 = null;
    this.assessment.outcome = null;
    this.assessment.documentation = '';

    if (this.assessment.question2 === 'yes') {
      this.assessment.outcome = 'NOT_APPLICABLE';
      this.assessment.documentation = 'Vendor must describe the additional measures that authenticate the connection or trust relation during the temporary exposure. Example: A short-range pairing protocol where the user must physically interact with both devices.';
      this.showOutcome = true;
    }
  }

  onQuestion3Change(): void {
    this.showOutcome = true;
    
    if (this.assessment.question3 === 'yes') {
      this.assessment.outcome = 'NOT_APPLICABLE';
      this.assessment.documentation = 'Vendor must describe the physical or logical measures in the environment that protect the communication. Example: Communication occurs only over a wired Ethernet connection inside a locked server room.';
    } else if (this.assessment.question3 === 'no') {
      this.assessment.outcome = 'FAIL';
      this.assessment.documentation = 'A FAIL verdict means the equipment is non-compliant with SCM-1. The communication of the asset is not secured by a mechanism, and no valid exception applies. The equipment must be redesigned to either implement a secure communication mechanism (leading to PASS) or to meet the requirements of one of the exceptions.';
    }
  }

  submitAssessment(): void {
    if (this.assessment.outcome) {
      this.assessment.completedAt = new Date();
      
      // Save to robot service
      const robotData = this.robotService.getRobotData();
      if (!robotData.assessments) {
        robotData.assessments = {};
      }
      robotData.assessments.scm1 = this.assessment;
      
      // Update robot data
      this.robotService.updateRobotData(robotData);
      
      // Navigate back to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  canSubmit(): boolean {
    return this.assessment.outcome !== null;
  }

  navigateBack(): void {
    this.router.navigate(['/assessment-selection']);
  }
}
