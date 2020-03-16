import { NgModule } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fontAwesomeLibraries } from "src/app/app.helper";
import {
  formlyAccessors,
  sharedComponents,
  sharedModules
} from "./shared.components";

/**
 * Shared Components Module
 */
@NgModule({
  declarations: [...sharedComponents, ...formlyAccessors],
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
