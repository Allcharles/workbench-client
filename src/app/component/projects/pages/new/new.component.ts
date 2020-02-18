import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem
} from "../../projects.menus";
import { projectsMenuItemActions } from "../list/list.component";
import data from "./new.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectsMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  canDeactivate: true,
  self: newProjectMenuItem
})
@Component({
  selector: "app-projects-new",
  template: `
    <app-form
      [schema]="schema"
      [title]="'New Project'"
      [error]="error"
      [success]="success"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: string;
  loading: boolean;
  schema = data;
  success: string;

  constructor(private api: ProjectsService, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    console.log($event);

    this.loading = true;
    this.ref.detectChanges();

    this.api
      .create(new Project($event))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.success = "Project was successfully created.";
          this.error = null;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.success = null;
          if (err.info && err.info.name && err.info.name.length === 1) {
            this.error = err.message + ": name " + err.info.name[0];
          } else {
            this.error = err.message;
          }

          this.loading = false;
        }
      );
  }
}
