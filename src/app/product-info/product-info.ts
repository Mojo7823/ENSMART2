import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { RobotService, RobotData } from '../robot';

@Component({
  selector: 'app-product-info',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatExpansionModule,
    MatButtonModule
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css'
})
export class ProductInfo implements OnInit {
  robotData: RobotData = {};
  panelOpenState = false;

  constructor(
    private robotService: RobotService,
    private router: Router
  ) {}

  ngOnInit() {
    this.robotData = this.robotService.getRobotData();
  }

  navigateToClassification(): void {
    this.router.navigate(['/robot-classification']);
  }

  navigateToRobotForm(): void {
    this.router.navigate(['/robot-information-form']);
  }

  navigateToTechnicalDocumentation(): void {
    this.router.navigate(['/technical-documentation']);
  }

  navigateToSCMAssessment(): void {
    this.router.navigate(['/scm-assessment']);
  }
}