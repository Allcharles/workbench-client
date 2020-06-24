import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {
  Configuration,
  Environment,
  isConfiguration,
  Values,
} from "src/app/helpers/app-initializer/app-initializer";
import { environment } from "src/environments/environment";

/**
 * App Config Service.
 * Handles access to the deployment environment.
 */
@Injectable()
export class AppConfigService {
  private _config: Configuration;

  constructor(private notification: ToastrService) {
    if (!isConfiguration(environment)) {
      console.error("Detected invalid environment.");
      this.notification.error(
        "The website is not configured correctly. Try coming back at another time.",
        "Unrecoverable Error",
        {
          closeButton: false,
          disableTimeOut: true,
          tapToDismiss: false,
          positionClass: "toast-center-center",
        }
      );
      return;
    }

    this._config = new Proxy(environment, {});
  }

  /**
   * Get config data
   */
  get config(): Configuration {
    return this._config;
  }

  /**
   * Get environment values
   */
  get environment(): Environment {
    return this._config.environment;
  }

  /**
   * Get config values
   */
  get values(): Values {
    return this._config.values;
  }
}
