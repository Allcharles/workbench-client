import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./component/home/home.component";
import { FormlyEmailInput } from "./component/shared/formly/email/email.component";
import { BawApiService } from "./services/baw-api/baw-api.service";

import { sharedComponents } from "./component/shared/shared.components";
import { AuthenticationModule } from "./component/authentication/authentication.module";
@NgModule({
  declarations: [
    AppComponent,
    FormlyEmailInput,
    HomeComponent,
    sharedComponents
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      types: [{ name: "email", component: FormlyEmailInput }]
    }),
    FormlyBootstrapModule,
    AuthenticationModule
  ],
  providers: [BawApiService],
  bootstrap: [AppComponent],
  exports: [HomeComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
