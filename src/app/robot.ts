import { Injectable } from '@angular/core';

export interface RobotClassificationResult {
  category: string;
  type: string;
  description: string;
}

export interface RobotInformation {
  name: string;
  firmwareVersion: string;
  mainFunction: string;
  description: string;
  // SCM Assessment related fields
  communicationProtocols: string;
  securityMechanisms: string;
  networkInterfaces: string;
  authenticationMethods: string;
  encryptionDetails: string;
  environmentalContext: string;
  interoperabilityRequirements: string;
  assetCommunicationDetails: string;
}

export interface RobotData {
  classification?: RobotClassificationResult;
  information?: RobotInformation;
  uploadedFiles?: UploadedFile[];
  assessments?: AssessmentResults;
}

export interface AssessmentResults {
  scm1?: SCMAssessmentData;
  scm2?: SCM2AssessmentData;
}

export interface SCMAssessmentData {
  question1: 'yes' | 'no' | null;
  question2: 'yes' | 'no' | null;
  question3: 'yes' | 'no' | null;
  outcome: 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | null;
  documentation: string;
  completedAt: Date;
  // Additional information fields
  securityMechanismDescription: string;
  assetCommunicationDetails: string;
  connectionEstablishmentDetails: string;
  temporaryExposureScenario: string;
  environmentalProtectionMeasures: string;
}

export interface SCM2AssessmentData {
  question1: 'yes' | 'no' | null;
  question2: 'yes' | 'no' | null;
  outcome: 'PASS' | 'FAIL' | 'NOT_APPLICABLE' | null;
  documentation: string;
  completedAt: Date;
  // Additional information fields
  securityMechanismCapabilities: string;
  threatProtectionDetails: string;
  interoperabilityConstraints: string;
  compensatingMeasures: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  data?: string; // Base64 encoded file data for PDF files
  processingMethod: 'words' | 'images'; // PDF processing method
}

@Injectable({
  providedIn: 'root'
})
export class RobotService {
  private storageKey = 'robotData';

  constructor() { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  getRobotData(): RobotData {
    if (!this.isBrowser()) {
      return {};
    }
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  setRobotClassification(classification: RobotClassificationResult): void {
    if (!this.isBrowser()) {
      return;
    }
    const data = this.getRobotData();
    data.classification = classification;
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  setRobotInformation(information: RobotInformation): void {
    if (!this.isBrowser()) {
      return;
    }
    const data = this.getRobotData();
    data.information = information;
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  updateRobotData(data: RobotData): void {
    if (!this.isBrowser()) {
      return;
    }
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  clearRobotData(): void {
    if (!this.isBrowser()) {
      return;
    }
    sessionStorage.removeItem(this.storageKey);
  }

  // XML Export/Import functionality
  exportToXML(): string {
    const data = this.getRobotData();
    const timestamp = new Date().toISOString();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<robotSession timestamp="${timestamp}">
  <metadata>
    <version>1.0</version>
    <exportDate>${timestamp}</exportDate>
  </metadata>`;

    if (data.information) {
      xml += `
  <robotInformation>
    <name><![CDATA[${data.information.name || ''}]]></name>
    <firmwareVersion><![CDATA[${data.information.firmwareVersion || ''}]]></firmwareVersion>
    <mainFunction><![CDATA[${data.information.mainFunction || ''}]]></mainFunction>
    <description><![CDATA[${data.information.description || ''}]]></description>
    <communicationProtocols><![CDATA[${data.information.communicationProtocols || ''}]]></communicationProtocols>
    <securityMechanisms><![CDATA[${data.information.securityMechanisms || ''}]]></securityMechanisms>
    <networkInterfaces><![CDATA[${data.information.networkInterfaces || ''}]]></networkInterfaces>
    <authenticationMethods><![CDATA[${data.information.authenticationMethods || ''}]]></authenticationMethods>
    <encryptionDetails><![CDATA[${data.information.encryptionDetails || ''}]]></encryptionDetails>
    <environmentalContext><![CDATA[${data.information.environmentalContext || ''}]]></environmentalContext>
    <interoperabilityRequirements><![CDATA[${data.information.interoperabilityRequirements || ''}]]></interoperabilityRequirements>
    <assetCommunicationDetails><![CDATA[${data.information.assetCommunicationDetails || ''}]]></assetCommunicationDetails>
  </robotInformation>`;
    }

    if (data.classification) {
      xml += `
  <robotClassification>
    <category><![CDATA[${data.classification.category}]]></category>
    <type><![CDATA[${data.classification.type}]]></type>
    <description><![CDATA[${data.classification.description}]]></description>
  </robotClassification>`;
    }

    if (data.uploadedFiles && data.uploadedFiles.length > 0) {
      xml += `
  <uploadedFiles>`;
      data.uploadedFiles.forEach(file => {
        xml += `
    <file>
      <name><![CDATA[${file.name}]]></name>
      <size>${file.size}</size>
      <type><![CDATA[${file.type}]]></type>
      <uploadDate><![CDATA[${file.uploadDate}]]></uploadDate>
      <processingMethod><![CDATA[${file.processingMethod}]]></processingMethod>
      ${file.data ? `<data><![CDATA[${file.data}]]></data>` : ''}
    </file>`;
      });
      xml += `
  </uploadedFiles>`;
    }

    if (data.assessments) {
      xml += `
  <assessments>`;
      
      if (data.assessments.scm1) {
        const scm1 = data.assessments.scm1;
        xml += `
    <scm1>
      <question1><![CDATA[${scm1.question1 || ''}]]></question1>
      <question2><![CDATA[${scm1.question2 || ''}]]></question2>
      <question3><![CDATA[${scm1.question3 || ''}]]></question3>
      <outcome><![CDATA[${scm1.outcome || ''}]]></outcome>
      <documentation><![CDATA[${scm1.documentation || ''}]]></documentation>
      <completedAt><![CDATA[${scm1.completedAt}]]></completedAt>
      <securityMechanismDescription><![CDATA[${scm1.securityMechanismDescription || ''}]]></securityMechanismDescription>
      <assetCommunicationDetails><![CDATA[${scm1.assetCommunicationDetails || ''}]]></assetCommunicationDetails>
      <connectionEstablishmentDetails><![CDATA[${scm1.connectionEstablishmentDetails || ''}]]></connectionEstablishmentDetails>
      <temporaryExposureScenario><![CDATA[${scm1.temporaryExposureScenario || ''}]]></temporaryExposureScenario>
      <environmentalProtectionMeasures><![CDATA[${scm1.environmentalProtectionMeasures || ''}]]></environmentalProtectionMeasures>
    </scm1>`;
      }
      
      if (data.assessments.scm2) {
        const scm2 = data.assessments.scm2;
        xml += `
    <scm2>
      <question1><![CDATA[${scm2.question1 || ''}]]></question1>
      <question2><![CDATA[${scm2.question2 || ''}]]></question2>
      <outcome><![CDATA[${scm2.outcome || ''}]]></outcome>
      <documentation><![CDATA[${scm2.documentation || ''}]]></documentation>
      <completedAt><![CDATA[${scm2.completedAt}]]></completedAt>
      <securityMechanismCapabilities><![CDATA[${scm2.securityMechanismCapabilities || ''}]]></securityMechanismCapabilities>
      <threatProtectionDetails><![CDATA[${scm2.threatProtectionDetails || ''}]]></threatProtectionDetails>
      <interoperabilityConstraints><![CDATA[${scm2.interoperabilityConstraints || ''}]]></interoperabilityConstraints>
      <compensatingMeasures><![CDATA[${scm2.compensatingMeasures || ''}]]></compensatingMeasures>
    </scm2>`;
      }
      
      xml += `
  </assessments>`;
    }

    xml += `
</robotSession>`;
    
    return xml;
  }

  importFromXML(xmlContent: string): boolean {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      // Check for parsing errors
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        console.error('XML parsing error');
        return false;
      }

      const robotSession = xmlDoc.getElementsByTagName('robotSession')[0];
      if (!robotSession) {
        console.error('Invalid XML format: missing robotSession element');
        return false;
      }

      const data: RobotData = {};

      // Import robot information
      const robotInfo = xmlDoc.getElementsByTagName('robotInformation')[0];
      if (robotInfo) {
        data.information = {
          name: this.getTextContent(robotInfo, 'name'),
          firmwareVersion: this.getTextContent(robotInfo, 'firmwareVersion'),
          mainFunction: this.getTextContent(robotInfo, 'mainFunction'),
          description: this.getTextContent(robotInfo, 'description'),
          communicationProtocols: this.getTextContent(robotInfo, 'communicationProtocols'),
          securityMechanisms: this.getTextContent(robotInfo, 'securityMechanisms'),
          networkInterfaces: this.getTextContent(robotInfo, 'networkInterfaces'),
          authenticationMethods: this.getTextContent(robotInfo, 'authenticationMethods'),
          encryptionDetails: this.getTextContent(robotInfo, 'encryptionDetails'),
          environmentalContext: this.getTextContent(robotInfo, 'environmentalContext'),
          interoperabilityRequirements: this.getTextContent(robotInfo, 'interoperabilityRequirements'),
          assetCommunicationDetails: this.getTextContent(robotInfo, 'assetCommunicationDetails')
        };
      }

      // Import robot classification
      const robotClassification = xmlDoc.getElementsByTagName('robotClassification')[0];
      if (robotClassification) {
        data.classification = {
          category: this.getTextContent(robotClassification, 'category'),
          type: this.getTextContent(robotClassification, 'type'),
          description: this.getTextContent(robotClassification, 'description')
        };
      }

      // Import uploaded files
      const uploadedFiles = xmlDoc.getElementsByTagName('uploadedFiles')[0];
      if (uploadedFiles) {
        data.uploadedFiles = [];
        const files = uploadedFiles.getElementsByTagName('file');
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uploadedFile: UploadedFile = {
            name: this.getTextContent(file, 'name'),
            size: parseInt(this.getTextContent(file, 'size')) || 0,
            type: this.getTextContent(file, 'type'),
            uploadDate: this.getTextContent(file, 'uploadDate'),
            data: this.getTextContent(file, 'data'),
            processingMethod: this.getTextContent(file, 'processingMethod') as 'words' | 'images' || 'words'
          };
          data.uploadedFiles.push(uploadedFile);
        }
      }

      // Store the imported data
      if (this.isBrowser()) {
        sessionStorage.setItem(this.storageKey, JSON.stringify(data));
      }

      return true;
    } catch (error) {
      console.error('Error importing XML:', error);
      return false;
    }
  }

  private getTextContent(parent: Element, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }

  // File upload functionality
  addUploadedFile(file: UploadedFile): void {
    if (!this.isBrowser()) {
      return;
    }
    const data = this.getRobotData();
    if (!data.uploadedFiles) {
      data.uploadedFiles = [];
    }
    data.uploadedFiles.push(file);
    sessionStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getUploadedFiles(): UploadedFile[] {
    const data = this.getRobotData();
    return data.uploadedFiles || [];
  }

  removeUploadedFile(fileName: string): void {
    if (!this.isBrowser()) {
      return;
    }
    const data = this.getRobotData();
    if (data.uploadedFiles) {
      data.uploadedFiles = data.uploadedFiles.filter(f => f.name !== fileName);
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }
}
