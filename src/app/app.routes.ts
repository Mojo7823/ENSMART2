import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { RobotClassificationComponent } from './robot-classification/robot-classification';
import { RobotInformationForm } from './robot-information-form/robot-information-form';
import { SharedLayout } from './shared-layout/shared-layout';
import { PdfManagerComponent } from './pdf-manager/pdf-manager';
import { SettingsComponent } from './settings/settings';
import { ChatComponent } from './chat/chat';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base';
import { AssessmentSelection } from './assessment-selection/assessment-selection';
import { ScmAssessment } from './scm-assessment/scm-assessment';
import { Scm2Assessment } from './scm2-assessment/scm2-assessment';

export const routes: Routes = [
  { path: '', component: Home },
  { 
    path: '', 
    component: SharedLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'assessment-selection', component: AssessmentSelection },
      { path: 'scm-assessment', component: ScmAssessment },
      { path: 'scm2-assessment', component: Scm2Assessment },
      { path: 'robot-classification', component: RobotClassificationComponent },
      { path: 'robot-information-form', component: RobotInformationForm },
      { path: 'pdf-manager', component: PdfManagerComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'knowledge-base', component: KnowledgeBaseComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];
