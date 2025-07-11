# PDF Upload Fix Documentation

## Overview
This fix addresses the PDF upload handling issue where the API was returning a 406 error with the message "Only purpose=batch is supported". The solution implements the recommended approaches from the Fireworks AI documentation for processing PDF files.

## Problem Fixed
- **Original Issue**: File upload failed with 406 error: "Only purpose=batch is supported"
- **Root Cause**: OpenAI-compatible APIs deprecated direct PDF processing and changed the allowed upload purposes
- **Solution**: Implemented two PDF processing approaches as recommended by the API documentation

## New PDF Processing Approaches

### 1. Text Extraction (Primary Method)
- Uses PDF.js to extract text content from PDF files
- Sends the extracted text directly to text-based language models
- Most efficient for text-heavy documents
- Preserves document structure and content

### 2. Image Conversion (Fallback Method)
- Converts PDF pages to images using PDF.js canvas rendering
- Sends images to vision-capable language models
- Useful for documents with diagrams, charts, or visual content
- Processes up to 3 pages to stay within API limits

## Implementation Details

### File Upload Changes
- Changed upload purpose from `'user_data'` to `'batch'` to comply with new API requirements
- Updated error handling to provide better feedback

### PDF Processing Flow
1. **File Detection**: Check if uploaded file is a PDF
2. **Text Extraction**: Attempt to extract text from PDF using PDF.js
3. **Text Processing**: If text is found, process with text model
4. **Image Fallback**: If no text or extraction fails, convert to images
5. **Vision Processing**: Send images to vision-capable models
6. **Model Selection**: Automatically select appropriate model based on content type

### Models Used
- **Text Content**: Uses configured text model (e.g., `llama-v3p3-70b-instruct`)
- **Image Content**: Automatically switches to vision models:
  - Fireworks AI: `accounts/fireworks/models/qwen2p5-vl-32b-instruct`
  - OpenAI: `gpt-4o`

## Usage

### Chat Interface
1. Click the attachment button (📎) in the chat interface
2. Select a PDF file (only PDF files are accepted)
3. Type your message or question about the PDF
4. Send the message
5. The system will automatically process the PDF and provide analysis

### Example Use Cases
- **Security Assessment**: Upload security reports and ask for analysis
- **Documentation Review**: Upload technical documentation and ask questions
- **Compliance Check**: Upload compliance documents and ask for summary
- **Threat Analysis**: Upload threat intelligence reports and ask for insights

## Error Handling
- **File Type Validation**: Only PDF files are accepted
- **File Size Limits**: 32MB maximum file size
- **Processing Errors**: Clear error messages for PDF processing failures
- **API Errors**: Improved error reporting for API communication issues

## Technical Changes

### Files Modified
- `src/app/llm-settings.service.ts`: Core PDF processing logic
- `src/app/chat/chat.ts`: Enhanced message handling
- `src/app/chat/chat.html`: Added image display support
- `src/app/chat/chat.css`: Styling for PDF images
- `package.json`: Added PDF processing dependencies

### Dependencies Added
- `pdf-parse`: For text extraction from PDFs
- `pdfjs-dist`: For PDF rendering and image conversion
- `@types/pdf-parse`: TypeScript definitions

### New Methods
- `extractTextFromPdf(file: File): Promise<string>`
- `convertPdfToImages(file: File, maxPages?: number): Promise<string[]>`
- `isUserMessageWithImages(message: ChatMessage): boolean`
- `getImagesFromMessage(message: ChatMessage): string[]`

## Configuration

### PDF.js Worker
The PDF.js worker file is automatically copied to `public/assets/pdf.worker.min.mjs` during build.

### Model Configuration
Vision models are automatically selected when processing PDF images. You can configure the preferred models in the LLM settings.

## Testing

### Unit Tests
- Added comprehensive tests for PDF processing functionality
- Tests verify correct API calls and message formatting
- Tests ensure proper error handling

### Manual Testing
1. Configure LLM settings with valid API credentials
2. Upload a PDF file in the chat interface
3. Ask questions about the PDF content
4. Verify that the AI can understand and respond to PDF content

## Troubleshooting

### Common Issues
1. **PDF.js Worker Not Found**: Ensure `pdf.worker.min.mjs` is in `public/assets/`
2. **Large PDF Files**: Files over 32MB will be rejected
3. **Complex PDFs**: Some PDFs with complex layouts may not extract text perfectly
4. **API Rate Limits**: Large images may consume more API tokens

### Debug Information
- Enable console logging to see PDF processing steps
- Check network tab for API request/response details
- Verify PDF.js worker is loaded correctly

## Benefits
- **Improved Compatibility**: Works with latest OpenAI-compatible APIs
- **Better Content Understanding**: AI can now actually read and analyze PDF content
- **Flexible Processing**: Handles both text and visual PDF content
- **Enhanced User Experience**: Clear feedback during PDF processing
- **Robust Error Handling**: Better error messages and recovery

## Migration Notes
This fix is backward compatible. Existing chat sessions will continue to work, and text-only messages are unaffected. The fix specifically addresses PDF file handling while maintaining all existing functionality.