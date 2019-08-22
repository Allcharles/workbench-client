import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { validationMessages } from "./app.helper";
import { AboutModule } from "./component/about/about.module";
import { ErrorModule } from "./component/error/error.module";
import { HomeModule } from "./component/home/home.module";
import { ProjectsModule } from "./component/projects/projects.module";
import { SecurityModule } from "./component/security/security.module";
import { SharedModule } from "./component/shared/shared.module";
import { BawApiInterceptor } from "./services/baw-api/base-api.interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      validationMessages
    }),
    FormlyBootstrapModule,
    LoadingBarHttpClientModule,
    SharedModule,
    SecurityModule,
    AboutModule,
    ProjectsModule,
    // these last two must be last!
    HomeModule,
    ErrorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
