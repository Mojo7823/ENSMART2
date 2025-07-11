import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-assessment-selection',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './assessment-selection.html',
  styleUrl: './assessment-selection.css'
})
export class AssessmentSelection {
  constructor(private router: Router) {}

  navigateToISO13482(): void {
    this.router.navigate(['/robot-classification']);
  }

  navigateToSCM(): void {
    this.router.navigate(['/scm-assessment']);
  }

  navigateToSCM2(): void {
    this.router.navigate(['/scm2-assessment']);
  }
}
