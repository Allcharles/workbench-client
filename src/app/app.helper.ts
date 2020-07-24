import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { serviceProviders } from "@baw-api/ServiceProviders";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { ConfigOption, FormlyFieldConfig } from "@ngx-formly/core";
import {
  formlyInputTypes,
  formlyWrappers,
} from "@shared/formly/custom-inputs.module";
import { GlobalConfig } from "ngx-toastr";
import { FormTouchedGuard } from "./guards/form/form.guard";
import {
  API_CONFIG,
  API_ROOT,
  AppInitializer,
  ASSET_ROOT,
  CMS_ROOT,
} from "./helpers/app-initializer/app-initializer";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";

/**
 * Input min length validation message
 * @param err Error message
 * @param field Formly field
 */
export function minLengthValidationMessage(_, field: FormlyFieldConfig) {
  return `Input should have at least ${field.templateOptions.minLength} characters`;
}

/**
 * Input max length validation message
 * @param err Error message
 * @param field Formly field
 */
export function maxLengthValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

/**
 * Number input min value validation message
 * @param err Error message
 * @param field Formly field
 */
export function minValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be more than ${field.templateOptions.min}`;
}

/**
 * Number input max value validation message
 * @param err Error message
 * @param field Formly field
 */
export function maxValidationMessage(_, field: FormlyFieldConfig) {
  return `This value should be less than ${field.templateOptions.max}`;
}

/**
 * Location validator
 */
export function locationValidator(control: AbstractControl) {
  const { latitude, longitude } = control.value;

  if (!isInstantiated(latitude) && !isInstantiated(longitude)) {
    return null;
  } else if (!isInstantiated(latitude) || !isInstantiated(longitude)) {
    return {
      location: {
        message: "Both latitude and longitude must be set or left empty",
      },
    };
  } else if (latitude < -90 || latitude > 90) {
    return { location: { message: "Latitude must be between -90 and 90" } };
  } else if (longitude < -180 || longitude > 180) {
    return { location: { message: "Longitude must be between -180 and 180" } };
  } else {
    return null;
  }
}

/**
 * Toastr Service global defaults
 */
export const toastrRoot: Partial<GlobalConfig> = {
  closeButton: true,
  enableHtml: true,
  positionClass: "toast-top-center",
};

/**
 * Formly types and validation messages
 */
export const formlyRoot: ConfigOption = {
  types: formlyInputTypes,
  wrappers: formlyWrappers,
  validationMessages: [
    { name: "required", message: "This field is required" },
    { name: "minlength", message: minLengthValidationMessage },
    { name: "maxlength", message: maxLengthValidationMessage },
    { name: "min", message: minValidationMessage },
    { name: "max", message: maxValidationMessage },
  ],
  validators: [{ name: "location", validation: locationValidator }],
};

/**
 * Load icon packs into font awesome library
 * @param library Font awesome library
 */
export function fontAwesomeLibraries(library: FaIconLibrary) {
  library.addIconPacks(fas);
}

/**
 * App providers
 */
export const providers = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: AppInitializer.initializerFactory,
    multi: true,
    deps: [API_CONFIG],
  },
  {
    provide: API_ROOT,
    useFactory: AppInitializer.apiRootFactory,
  },
  {
    provide: CMS_ROOT,
    useFactory: AppInitializer.cmsRootFactory,
  },
  {
    provide: ASSET_ROOT,
    useFactory: AppInitializer.assetRootFactory,
  },
  FormTouchedGuard,
  ...serviceProviders,
];
