import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductInfo } from './product-info';
import { RobotService } from '../robot';

describe('ProductInfo', () => {
  let component: ProductInfo;
  let fixture: ComponentFixture<ProductInfo>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRobotService: jasmine.SpyObj<RobotService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const robotServiceSpy = jasmine.createSpyObj('RobotService', ['getRobotData']);

    await TestBed.configureTestingModule({
      imports: [ProductInfo, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotService, useValue: robotServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInfo);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockRobotService = TestBed.inject(RobotService) as jasmine.SpyObj<RobotService>;
    
    mockRobotService.getRobotData.and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load robot data on init', () => {
    expect(mockRobotService.getRobotData).toHaveBeenCalled();
  });

  it('should navigate to classification', () => {
    component.navigateToClassification();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/robot-classification']);
  });

  it('should navigate to robot form', () => {
    component.navigateToRobotForm();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/robot-information-form']);
  });

  it('should navigate to technical documentation', () => {
    component.navigateToTechnicalDocumentation();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/technical-documentation']);
  });
});