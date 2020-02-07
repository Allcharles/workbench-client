import {
  AgmCoreModule,
  LAZY_MAPS_API_CONFIG,
  LazyMapsAPILoaderConfigLiteral
} from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { HttpClientModule } from "@angular/common/http";
import { forwardRef, Injectable, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormlyModule } from "@ngx-formly/core";
import { ToastrModule } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { formlyRoot, providers } from "./app.helper";
import { AboutModule } from "./component/about/about.module";
import { DataRequestModule } from "./component/data-request/data-request.module";
import { ErrorModule } from "./component/error/error.module";
import { HomeModule } from "./component/home/home.module";
import {
  MyAccountModule,
  ProfileModule
} from "./component/profile/profile.module";
import { ProjectsModule } from "./component/projects/projects.module";
import { ReportProblemsModule } from "./component/report-problem/report-problem.module";
import { SecurityModule } from "./component/security/security.module";
import { PermissionsShieldComponent } from "./component/shared/permissions-shield/permissions-shield.component";
import { SharedModule } from "./component/shared/shared.module";
import { WidgetDirective } from "./component/shared/widget/widget.directive";
import { SitesModule } from "./component/sites/sites.module";
import { StatisticsModule } from "./component/statistics/statistics.module";
import { retrieveAppConfig } from "./services/app-config/app-config.service";

export const appImports = [
  BrowserModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  HttpClientModule,
  AgmCoreModule.forRoot(),
  AgmSnazzyInfoWindowModule,
  FormlyModule.forRoot(formlyRoot),
  ToastrModule.forRoot({
    positionClass: "toast-top-center"
  }),
  SharedModule,
  SecurityModule,
  AboutModule,
  ProjectsModule,
  SitesModule,
  ReportProblemsModule,
  DataRequestModule,
  StatisticsModule,
  MyAccountModule,
  ProfileModule,
  // these last two must be last!
  HomeModule,
  ErrorModule
];

// tslint:disable-next-line: no-use-before-declare
@Injectable({ providedIn: forwardRef(() => AppModule) })
export class GoogleMapsConfig implements LazyMapsAPILoaderConfigLiteral {
  apiKey?: string;

  constructor() {
    retrieveAppConfig(
      data => {
        this.apiKey = data.values.keys.googleMaps;
        return data;
      },
      err => {
        console.error("Failed to load google api key: ", err);
        this.apiKey = "";
        return null;
      },
      environment.configUrl
    );
  }
}

@NgModule({
  declarations: [AppComponent, WidgetDirective],
  imports: [...appImports],
  providers: [
    ...providers,
    { provide: LAZY_MAPS_API_CONFIG, useClass: GoogleMapsConfig }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PermissionsShieldComponent],
  exports: []
})
export class AppModule {}
