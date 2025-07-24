import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { RobotService, RobotData } from '../robot';

@Component({
  selector: 'app-product-info',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
  robotData: RobotData | null = null;

  constructor(
    private router: Router,
    private robotService: RobotService
  ) {}

  ngOnInit() {
    // Get robot data from service
    this.robotData = this.robotService.getRobotData();
  }

  navigateToTechnicalDoc(): void {
    this.router.navigate(['/technical-documentation']);
  }

  navigateToClassification(): void {
    this.router.navigate(['/robot-classification']);
  }

  navigateToRobotForm(): void {
    this.router.navigate(['/robot-information-form']);
  }

  navigateToSCMAssessment(): void {
    this.router.navigate(['/scm-assessment']);
  }
}