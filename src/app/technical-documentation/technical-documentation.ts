import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-technical-documentation',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './technical-documentation.html',
  styleUrl: './technical-documentation.css'
})
export class TechnicalDocumentation implements OnInit {
  technicalForm: FormGroup;
  
  documentTypes = [
    'User Manual',
    'Technical Specifications',
    'Safety Guidelines',
    'Installation Guide',
    'Maintenance Manual',
    'API Documentation',
    'Compliance Certificate',
    'Other'
  ];

  priorityLevels = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.technicalForm = this.fb.group({
      documentTitle: ['', [Validators.required, Validators.minLength(3)]],
      documentType: ['', Validators.required],
      version: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      technicalDetails: ['', [Validators.required, Validators.minLength(20)]],
      safetyRequirements: [''],
      complianceStandards: [''],
      maintenanceInstructions: [''],
      troubleshootingGuide: [''],
      priority: ['medium', Validators.required],
      isPublic: [false],
      requiresApproval: [true],
      tags: ['']
    });
  }

  ngOnInit(): void {
    // Initialize form if needed
  }

  onSubmit(): void {
    if (this.technicalForm.valid) {
      const formData = this.technicalForm.value;
      console.log('Technical Documentation Data:', formData);
      
      // Here you would typically save the data to a service
      // For now, we'll just show a success message
      this.snackBar.open('Technical documentation saved successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      // Navigate back to dashboard or product info
      this.router.navigate(['/dashboard']);
    } else {
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  onReset(): void {
    this.technicalForm.reset();
    this.technicalForm.patchValue({
      priority: 'medium',
      isPublic: false,
      requiresApproval: true
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.technicalForm.controls).forEach(key => {
      const control = this.technicalForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.technicalForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters long`;
    }
    return '';
  }
}