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
import { RobotService, SCM2AssessmentData } from '../robot';

@Component({
  selector: 'app-scm2-assessment',
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
  templateUrl: './scm2-assessment.html',
  styleUrl: './scm2-assessment.css'
})
export class Scm2Assessment implements OnInit {
  assessment: SCM2AssessmentData = {
    question1: null,
    question2: null,
    outcome: null,
    documentation: '',
    completedAt: new Date(),
    securityMechanismCapabilities: '',
    threatProtectionDetails: '',
    interoperabilityConstraints: '',
    compensatingMeasures: ''
  };

  showQuestion2 = false;
  showOutcome = false;

  constructor(
    private router: Router,
    private robotService: RobotService
  ) {}

  ngOnInit(): void {
    // Load existing assessment data if it exists
    const robotData = this.robotService.getRobotData();
    if (robotData.assessments?.scm2) {
      this.assessment = { ...robotData.assessments.scm2 };
      this.updateFormState();
    }
    
    // Pre-populate fields from robot information if available
    if (robotData.information) {
      const info = robotData.information;
      if (!this.assessment.securityMechanismCapabilities && info.securityMechanisms) {
        this.assessment.securityMechanismCapabilities = info.securityMechanisms;
      }
      if (!this.assessment.interoperabilityConstraints && info.interoperabilityRequirements) {
        this.assessment.interoperabilityConstraints = info.interoperabilityRequirements;
      }
    }
  }

  private updateFormState(): void {
    // Update form state based on assessment data
    if (this.assessment.question1 === 'no') {
      this.showQuestion2 = true;
      if (this.assessment.question2 !== null) {
        this.showOutcome = true;
      }
    } else if (this.assessment.question1 === 'yes') {
      this.showOutcome = true;
    }
  }

  onQuestion1Change(): void {
    this.showQuestion2 = this.assessment.question1 === 'no';
    this.showOutcome = false;
    this.assessment.question2 = null;
    this.assessment.outcome = null;
    this.assessment.documentation = '';

    if (this.assessment.question1 === 'yes') {
      this.assessment.outcome = 'PASS';
      this.assessment.documentation = 'You must describe how the mechanism implements best practices to protect against integrity and authenticity threats.';
      this.showOutcome = true;
    }
  }

  onQuestion2Change(): void {
    this.showOutcome = true;
    
    if (this.assessment.question2 === 'yes') {
      this.assessment.outcome = 'NOT_APPLICABLE';
      this.assessment.documentation = 'Vendor must provide a clear justification for why a deviation from best practice is unavoidable due to interoperability requirements.';
    } else if (this.assessment.question2 === 'no') {
      this.assessment.outcome = 'FAIL';
      this.assessment.documentation = 'A FAIL verdict means the equipment is non-compliant with SCM-2. This occurs if the secure communication mechanism deviates from best practices for a reason other than interoperability.';
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
      robotData.assessments.scm2 = this.assessment;
      
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