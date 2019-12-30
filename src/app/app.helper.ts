import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  APP_CONFIG,
  AppConfigService
} from "./services/app-config/app-config.service";
import {
  APP_CONFIG as MOCK_APP_CONFIG,
  MockAppConfigService
} from "./services/app-config/appConfigMockService";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor";
import { AudioRecordingsService } from "./services/baw-api/audio-recordings.service";
import { BawApiService } from "./services/baw-api/base-api.service";
import { MockAudioRecordingsService } from "./services/baw-api/mock/audioRecordingsMockService";
import { MockBawApiService } from "./services/baw-api/mock/baseApiMockService";
import { MockProjectsService } from "./services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "./services/baw-api/mock/securityMockService";
import { MockSitesService } from "./services/baw-api/mock/sitesMockService";
import { MockUserService } from "./services/baw-api/mock/userMockService";
import { ProjectsService } from "./services/baw-api/projects.service";
import { SecurityService } from "./services/baw-api/security.service";
import { SitesService } from "./services/baw-api/sites.service";
import { UserService } from "./services/baw-api/user.service";

function minLengthValidationMessage(err, field) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export const validationMessages = [
  { name: "required", message: "This field is required" },
  { name: "minlength", message: minLengthValidationMessage },
  { name: "maxlength", message: maxLengthValidationMessage },
  { name: "min", message: minValidationMessage },
  { name: "max", message: maxValidationMessage }
];

export function appInitializerFn(appConfig: AppConfigService) {
  return () => {
    return appConfig.loadAppConfig();
  };
}

export const providers = [
  AppConfigService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  {
    provide: APP_CONFIG,
    useValue: environment.appConfig
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppConfigService]
  }
];

export const testAppInitializer = [
  {
    provide: AppConfigService,
    useClass: MockAppConfigService
  },
  {
    provide: MOCK_APP_CONFIG,
    useValue: `http://${window.location.host}/assets/tests/remoteEnvironment.json`
  },
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppConfigService]
  }
];

export const testBawServices = [
  ...testAppInitializer,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  { provide: BawApiService, useClass: MockBawApiService },
  { provide: SecurityService, useClass: MockSecurityService },
  { provide: ProjectsService, useClass: MockProjectsService },
  { provide: SitesService, useClass: MockSitesService },
  { provide: UserService, useClass: MockUserService },
  { provide: AudioRecordingsService, useClass: MockAudioRecordingsService }
];
