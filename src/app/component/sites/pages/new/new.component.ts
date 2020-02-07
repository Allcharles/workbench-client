import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { projectMenuItemActions } from "src/app/component/projects/pages/details/details.component";
import { projectMenuItem } from "src/app/component/projects/projects.menus";
import { flattenFields } from "src/app/component/shared/form/form.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { newSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./new.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    links: List()
  },
  self: newSiteMenuItem
})
@Component({
  selector: "app-sites-new",
  template: `
    <app-form
      *ngIf="ready"
      [schema]="schema"
      [title]="'New Site'"
      [error]="error"
      [success]="success"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class NewComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  success: string;

  projectId: Id;

  constructor(
    private sitesApi: SitesService,
    private projectsApi: ProjectsService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          return this.projectsApi.show(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.ready = true;
        },
        (err: ApiErrorDetails) => {
          this.errorDetails = err;
          this.ready = false;
        }
      );
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
    this.loading = true;
    this.ref.detectChanges();

    const input = new Site(flattenFields($event));

    this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.create(input, params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.success = "Site was successfully created.";
          this.error = null;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.success = null;
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
