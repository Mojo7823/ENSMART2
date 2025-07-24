import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technical-documentation',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  templateUrl: './technical-documentation.html',
  styleUrl: './technical-documentation.css',
})
export class TechnicalDocumentation {
  technicalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.technicalForm = this.fb.group({
      productName: ['', Validators.required],
      modelNumber: ['', Validators.required],
      serialNumber: [''],
      manufacturer: ['', Validators.required],
      version: ['', Validators.required],
      operatingSystem: [''],
      processorType: [''],
      memorySize: [''],
      storageCapacity: [''],
      powerRequirements: [''],
      operatingTemperature: [''],
      dimensions: [''],
      weight: [''],
      networkCapabilities: [''],
      securityFeatures: [''],
      complianceStandards: [''],
      technicalSpecifications: [''],
      installationInstructions: [''],
      maintenanceSchedule: [''],
      troubleshootingGuide: [''],
      safetyInstructions: [''],
      warrantyInformation: [''],
      supportContact: [''],
      documentationVersion: ['1.0', Validators.required],
      lastUpdated: [new Date().toISOString().split('T')[0], Validators.required],
      isCompleted: [false]
    });
  }

  onSubmit(): void {
    if (this.technicalForm.valid) {
      const formData = this.technicalForm.value;
      console.log('Technical Documentation Data:', formData);
      
      // Here you would typically save to a service
      // For now, we'll just show a success message
      this.snackBar.open('Technical documentation saved successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      // Optionally navigate back to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  onReset(): void {
    this.technicalForm.reset();
    this.technicalForm.patchValue({
      documentationVersion: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      isCompleted: false
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}