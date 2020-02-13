import { version } from "../../package.json";

export const environment = {
  production: false,
  version,

  // These keys will be edited during runtime
  environment: "",
  configUrl: ""
};

import "zone.js/dist/zone-error"; // Included with Angular CLI.
