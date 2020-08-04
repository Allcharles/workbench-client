import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppConfigModule } from "../app-config/app-config.module";
import { BawApiInterceptor } from "./api.interceptor.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";

@NgModule({
  imports: [HttpClientModule, AppConfigModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    SecurityService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
  ],
})
export class BawApiModule {}