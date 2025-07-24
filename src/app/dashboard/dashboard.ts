import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductInfo } from '../product-info/product-info';
import { RobotService } from '../robot';
import { SaveSessionDialog, LoadSessionDialog } from '../session-manager/session-manager';
import { ChatComponent } from '../chat/chat';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ProductInfo,
    ChatComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private robotService: RobotService
  ) {}

  navigateToAssessmentSelection(): void {
    this.router.navigate(['/assessment-selection']);
  }

  navigateToKnowledgeBase(): void {
    this.router.navigate(['/knowledge-base']);
  }

  openAddInformationDialog(): void {
    // Updated dialog with Technical Documentation option
    const dialogRef = this.dialog.open(AddInformationDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
      }
    });
  }

  // Refresh robot data when returning from classification
  ngOnInit() {
    // This will trigger update of robot information display
  }

  openSaveSessionDialog(): void {
    const dialogRef = this.dialog.open(SaveSessionDialog, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Session saved successfully - could show a success message here
        console.log('Session saved successfully');
      }
    });
  }

  openLoadSessionDialog(): void {
    const dialogRef = this.dialog.open(LoadSessionDialog, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Session loaded successfully - refresh the page or components
        console.log('Session loaded successfully');
        // Trigger a refresh by navigating to the same route
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }
}

// Updated dialog component for Add Information
@Component({
  selector: 'add-information-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Add Information</h2>
    <mat-dialog-content>
      <p>Select the type of information to add:</p>
      <div class="dialog-options">
        <button mat-raised-button color="primary" (click)="selectOption('robot-info')" class="option-btn">
          <mat-icon>info</mat-icon>
          Basic Product Information
        </button>
        <button mat-raised-button color="primary" (click)="selectOption('technical-docs')" class="option-btn">
          <mat-icon>description</mat-icon>
          Technical Documentation
        </button>
        <button mat-raised-button color="primary" (click)="selectOption('robot-specs')" class="option-btn">
          <mat-icon>settings</mat-icon>
          Product Specifications
        </button>
        <button mat-raised-button color="primary" (click)="selectOption('robot-compliance')" class="option-btn">
          <mat-icon>verified</mat-icon>
          Compliance Information
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="close()">Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;
    }
    .option-btn {
      padding: 12px 16px;
      text-align: left;
      justify-content: flex-start;
    }
    .option-btn mat-icon {
      margin-right: 12px;
    }
  `]
})
export class AddInformationDialog {
  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  selectOption(option: string): void {
    this.dialog.closeAll();
    
    switch (option) {
      case 'robot-info':
        this.router.navigate(['/robot-information-form']);
        break;
      case 'technical-docs':
        this.router.navigate(['/technical-documentation']);
        break;
      default:
        // For other options, navigate to technical documentation for now
        this.router.navigate(['/technical-documentation']);
        break;
    }
  }

  close(): void {
    this.dialog.closeAll();
  }
}