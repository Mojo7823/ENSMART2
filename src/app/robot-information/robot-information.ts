import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RobotService, RobotData } from '../robot';

@Component({
  selector: 'app-robot-information',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './robot-information.html',
  styleUrl: './robot-information.css'
})
export class RobotInformation implements OnInit {
  robotData: RobotData = {};

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

  navigateToSCMAssessment(): void {
    this.router.navigate(['/scm-assessment']);
  }
}
