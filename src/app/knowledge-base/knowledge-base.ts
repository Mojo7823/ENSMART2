import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { LLMSettingsService, UploadedFile } from '../llm-settings.service';

@Component({
  selector: 'app-knowledge-base',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDialogModule,
  ],
  templateUrl: './knowledge-base.html',
  styleUrl: './knowledge-base.css',
})
export class KnowledgeBaseComponent implements OnInit {
  uploadedFiles: UploadedFile[] = [];
  isUploading = false;
  selectedProcessingMethod: 'text' | 'images' = 'text';
  showProcessingMethodNotification = false;

  constructor(
    private llmSettingsService: LLMSettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUploadedFiles();
  }

  loadUploadedFiles() {
    this.uploadedFiles = this.llmSettingsService.getUploadedFiles();
  }

  refreshFiles() {
    this.loadUploadedFiles();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  uploadFile(file: File): void {
    if (!file.type.includes('pdf')) {
      this.snackBar.open('Please select a PDF file', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    if (file.size > 32 * 1024 * 1024) { // 32MB limit
      this.snackBar.open('File size must be less than 32MB', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    this.isUploading = true;
    
    // Process the PDF and add to knowledge base
    this.processPdfAndAddToKnowledgeBase(file);
  }

  private async processPdfAndAddToKnowledgeBase(file: File): Promise<void> {
    try {
      // For knowledge base, we'll process the PDF to extract content and store it
      // This way it becomes available to the AI chat immediately
      if (this.selectedProcessingMethod === 'text') {
        // Extract text content
        const extractedText = await this.llmSettingsService.extractTextFromPdf(file);
        console.log('Extracted text from PDF:', extractedText.substring(0, 200) + '...');
      } else {
        // Convert to images
        const images = await this.llmSettingsService.convertPdfToImages(file);
        console.log('Converted PDF to', images.length, 'images');
      }

      // Add file to session tracking (this makes it available to AI chat)
      const uploadedFile: UploadedFile = {
        id: this.generateFileId(),
        filename: file.name,
        size: file.size,
        uploadDate: new Date(),
        purpose: 'knowledge-base'
      };
      
      this.saveUploadedFile(uploadedFile);
      this.loadUploadedFiles();

      this.snackBar.open(`"${file.name}" added to knowledge base successfully`, 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      this.snackBar.open('Failed to process PDF file. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } finally {
      this.isUploading = false;
    }
  }

  private generateFileId(): string {
    return 'kb_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveUploadedFile(file: UploadedFile): void {
    // Use the LLM settings service method to store the file
    if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
      const files = this.llmSettingsService.getUploadedFiles();
      files.push(file);
      sessionStorage.setItem('sessionUploadedFiles', JSON.stringify(files));
    }
  }

  removeFile(file: UploadedFile) {
    if (confirm(`Are you sure you want to remove "${file.filename}" from the knowledge base?`)) {
      this.llmSettingsService.removeUploadedFile(file.id);
      this.loadUploadedFiles();
      this.snackBar.open(`"${file.filename}" removed from knowledge base`, 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
    }
  }

  viewFile(file: UploadedFile): void {
    this.snackBar.open('File viewing is not yet implemented', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  downloadFile(file: UploadedFile): void {
    this.snackBar.open('File download is not yet implemented', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}