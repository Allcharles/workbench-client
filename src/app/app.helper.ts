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
} from "./services/app-config/mock-app-config.service";
import { BawApiInterceptor } from "./services/baw-api/base-api.interceptor";
import { BawApiService } from "./services/baw-api/base-api.service";
import { MockProjectsService } from "./services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "./services/baw-api/mock/securityMockService";
import { MockSitesService } from "./services/baw-api/mock/sitesMockService";
import { ProjectsService } from "./services/baw-api/projects.service";
import { SecurityService } from "./services/baw-api/security.service";
import { SitesService } from "./services/baw-api/sites.service";

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
  BawApiService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  { provide: SecurityService, useClass: MockSecurityService },
  { provide: ProjectsService, useClass: MockProjectsService },
  { provide: SitesService, useClass: MockSitesService }
];
