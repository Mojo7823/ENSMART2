import { TestBed } from '@angular/core/testing';
import { LLMSettingsService } from './llm-settings.service';

describe('LLMSettingsService PDF Processing', () => {
  let service: LLMSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LLMSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have PDF processing methods', () => {
    expect(service.extractTextFromPdf).toBeDefined();
    expect(service.convertPdfToImages).toBeDefined();
  });

  it('should handle file upload with batch purpose', async () => {
    // Mock fetch to simulate API response
    const mockResponse = {
      ok: true,
      json: async () => ({ id: 'test-file-id' })
    };
    
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as Response));
    
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    // Mock the service configuration
    spyOn(service, 'isLLMConfigured').and.returnValue(true);
    spyOn(service, 'getLLMConfig').and.returnValue({
      enabled: true,
      provider: 'custom',
      apiKey: 'test-key',
      apiHost: 'https://api.test.com/v1',
      model: 'test-model'
    });
    
    const result = await service.uploadFile(testFile);
    
    expect(result).toBe('test-file-id');
    expect(window.fetch).toHaveBeenCalledWith(
      'https://api.test.com/v1/files',
      jasmine.objectContaining({
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-key'
        }
      })
    );
  });

  it('should handle sendMessage with PDF processing', async () => {
    // Mock PDF processing methods
    spyOn(service, 'extractTextFromPdf').and.returnValue(Promise.resolve('Sample PDF content'));
    spyOn(service, 'isLLMConfigured').and.returnValue(true);
    spyOn(service, 'getLLMConfig').and.returnValue({
      enabled: true,
      provider: 'custom',
      apiKey: 'test-key',
      apiHost: 'https://api.test.com/v1',
      model: 'test-model'
    });
    
    // Mock fetch for chat completion
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: 'This is a test response'
          }
        }]
      })
    };
    
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(mockResponse as Response));
    
    const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    const result = await service.sendMessage('Analyze this PDF', testFile);
    
    expect(result).toBe('This is a test response');
    expect(service.extractTextFromPdf).toHaveBeenCalledWith(testFile);
  });
});