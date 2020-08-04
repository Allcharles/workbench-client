import { APP_INITIALIZER, NgModule } from "@angular/core";
import {
  API_CONFIG,
  API_ROOT,
  AppInitializer,
  ASSET_ROOT,
  CMS_ROOT,
} from "@helpers/app-initializer/app-initializer";
import { ToastrModule } from "ngx-toastr";
import { AppConfigService } from "./app-config.service";

@NgModule({
  imports: [ToastrModule],
  providers: [
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
    AppConfigService,
  ],
})
export class AppConfigModule {}