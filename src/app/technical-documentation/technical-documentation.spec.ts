import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TechnicalDocumentation } from './technical-documentation';

describe('TechnicalDocumentation', () => {
  let component: TechnicalDocumentation;
  let fixture: ComponentFixture<TechnicalDocumentation>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TechnicalDocumentation, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalDocumentation);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.technicalForm.get('priority')?.value).toBe('medium');
    expect(component.technicalForm.get('isPublic')?.value).toBe(false);
    expect(component.technicalForm.get('requiresApproval')?.value).toBe(true);
  });

  it('should navigate to dashboard on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message for invalid form submission', () => {
    component.onSubmit();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should submit valid form successfully', () => {
    // Fill required fields
    component.technicalForm.patchValue({
      documentTitle: 'Test Document',
      documentType: 'User Manual',
      version: '1.0',
      author: 'Test Author',
      description: 'Test description for the document',
      technicalDetails: 'Detailed technical information about the product'
    });

    component.onSubmit();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Technical documentation saved successfully!',
      'Close',
      jasmine.any(Object)
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});