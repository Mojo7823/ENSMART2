import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LLMSettingsService } from '../llm-settings.service';

@Component({
  selector: 'app-llm-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="test-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>LLM PDF Processing Test</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="test-section">
            <h3>Configuration Test</h3>
            <p>LLM Configured: {{ isConfigured ? 'Yes' : 'No' }}</p>
            <button mat-raised-button color="primary" (click)="testConfiguration()">
              Test Configuration
            </button>
          </div>

          <div class="test-section">
            <h3>PDF File Upload Test</h3>
            <input type="file" accept=".pdf" (change)="onFileSelected($event)" />
            <button mat-raised-button color="primary" (click)="testTextExtraction()" [disabled]="!selectedFile || isLoading">
              Test Text Extraction
            </button>
            <button mat-raised-button color="accent" (click)="testImageConversion()" [disabled]="!selectedFile || isLoading">
              Test Image Conversion
            </button>
          </div>

          <div class="test-section">
            <h3>Basic Chat Test</h3>
            <mat-form-field appearance="fill">
              <mat-label>Test Message</mat-label>
              <input matInput [(ngModel)]="testMessage" placeholder="Enter test message">
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="testBasicChat()" [disabled]="!testMessage || isLoading">
              Send Test Message
            </button>
          </div>

          <div class="test-section" *ngIf="isLoading">
            <mat-spinner></mat-spinner>
            <p>Testing in progress...</p>
          </div>

          <div class="test-section" *ngIf="testResults.length > 0">
            <h3>Test Results</h3>
            <div *ngFor="let result of testResults" [class]="result.success ? 'success' : 'error'">
              <h4>{{ result.test }}</h4>
              <p>{{ result.message }}</p>
              <pre *ngIf="result.details">{{ result.details }}</pre>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .test-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .test-section h3 {
      margin-top: 0;
      color: #333;
    }

    .test-section button {
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .test-section mat-form-field {
      width: 100%;
      margin-bottom: 10px;
    }

    .success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    pre {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }

    mat-spinner {
      margin: 0 auto;
    }
  `]
})
export class LLMTestComponent implements OnInit {
  isConfigured = false;
  selectedFile: File | null = null;
  testMessage = 'What are the main cybersecurity vulnerabilities in robotic systems?';
  isLoading = false;
  testResults: Array<{test: string, success: boolean, message: string, details?: string}> = [];

  constructor(private llmSettingsService: LLMSettingsService) {}

  ngOnInit() {
    this.isConfigured = this.llmSettingsService.isLLMConfigured();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.addTestResult('File Selection', true, `Selected file: ${this.selectedFile.name} (${this.selectedFile.size} bytes)`);
    }
  }

  async testConfiguration() {
    this.isLoading = true;
    try {
      const config = this.llmSettingsService.getLLMConfig();
      this.addTestResult('Configuration', true, 'LLM Configuration loaded successfully', JSON.stringify(config, null, 2));
    } catch (error) {
      this.addTestResult('Configuration', false, 'Failed to load configuration', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  async testBasicChat() {
    this.isLoading = true;
    try {
      const response = await this.llmSettingsService.sendMessage(this.testMessage);
      this.addTestResult('Basic Chat', true, 'Chat message sent successfully', response.substring(0, 500) + '...');
    } catch (error) {
      this.addTestResult('Basic Chat', false, 'Chat message failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  async testTextExtraction() {
    if (!this.selectedFile) {
      this.addTestResult('Text Extraction', false, 'No file selected');
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.llmSettingsService.sendMessage(
        'Please analyze this PDF for security vulnerabilities',
        this.selectedFile,
        'text'
      );
      this.addTestResult('Text Extraction', true, 'PDF text extraction successful', response.substring(0, 500) + '...');
    } catch (error) {
      this.addTestResult('Text Extraction', false, 'PDF text extraction failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  async testImageConversion() {
    if (!this.selectedFile) {
      this.addTestResult('Image Conversion', false, 'No file selected');
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.llmSettingsService.sendMessage(
        'Please analyze this PDF for security vulnerabilities',
        this.selectedFile,
        'images'
      );
      this.addTestResult('Image Conversion', true, 'PDF image conversion successful', response.substring(0, 500) + '...');
    } catch (error) {
      this.addTestResult('Image Conversion', false, 'PDF image conversion failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isLoading = false;
    }
  }

  private addTestResult(test: string, success: boolean, message: string, details?: string) {
    this.testResults.push({
      test,
      success,
      message,
      details
    });
  }
}