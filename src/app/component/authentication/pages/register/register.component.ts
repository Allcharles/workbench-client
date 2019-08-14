import { Component, OnInit } from "@angular/core";

import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "user-plus"],
  label: "Register",
  category: securityCategory,
  routeFragment: "register",
  tooltip: () => "Create an account",
  predicate: user => !user,
  menus: null,
  order: { priority: 3, indentation: 0 }
})
@Component({
  selector: "app-authentication-register",
  template: `
    <app-form
      [schema]="schemaUrl"
      [title]="'Register'"
      [submitLoading]="loading"
      [error]="error"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class RegisterComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/register.json";
  error: string;
  loading: boolean;

  constructor(private api: SecurityService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.api.getLoggedInTrigger().subscribe(loggedIn => {
      if (loggedIn) {
        this.loading = true;
        this.error = "You are already logged in";
      } else {
        this.loading = false;
        this.error = null;
      }
    });
  }

  submit(model) {
    this.loading = true;
    console.log(model);
    this.loading = false;
  }
}
