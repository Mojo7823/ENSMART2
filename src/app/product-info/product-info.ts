import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RobotService, RobotData } from '../robot';

@Component({
  selector: 'app-product-info',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css'
})
export class ProductInfoComponent implements OnInit {
  robotData: RobotData = {};
  
  // Technical Documentation form data based on EN18031
  technicalDoc = {
    date: '',
    deviceName: '',
    hardwareConfig: '',
    operatingSystem: '',
    firmwareVersion: '',
    intendedFunctionality: '',
    userDocumentation: '',
    setupDocumentation: '',
    standardsApplied: 'EN 18031-1, EN 18031-2, EN 18031-3',
    isNetworkEquipment: 'No',
    isChildrensToy: 'No',
    isChildcareEquipment: 'No',
    isInternetConnected: 'No',
    processesPersonalInfo: 'No',
    manufacturerName: '',
    manufacturerAddress: '',
    manufacturerPhone: '',
    manufacturerEmail: '',
    manufacturerAdditionalInfo: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    contactPersonAdditionalInfo: ''
  };

  constructor(
    private robotService: RobotService,
    private router: Router
  ) {}

  ngOnInit() {
    this.robotData = this.robotService.getRobotData();
    // Pre-populate some fields from existing robot data
    if (this.robotData.information) {
      this.technicalDoc.deviceName = this.robotData.information.name || '';
      this.technicalDoc.firmwareVersion = this.robotData.information.firmwareVersion || '';
      this.technicalDoc.intendedFunctionality = this.robotData.information.mainFunction || '';
    }
  }

  saveTechnicalDocumentation() {
    // Save the technical documentation data
    console.log('Saving technical documentation:', this.technicalDoc);
    // You can implement actual save logic here
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