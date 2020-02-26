import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { flatMap, map, takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { environment } from "src/environments/environment";
import { projectsMenuItem } from "../projects/projects.menus";
import { Card } from "../shared/cards/cards.component";
import { homeCategory, homeMenuItem } from "./home.menus";

@Page({
  category: homeCategory,
  fullscreen: true,
  menus: null,
  self: homeMenuItem
})
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends PageComponent implements OnInit {
  public page: string;
  public moreProjectsLink = projectsMenuItem;
  public projectList: List<Card> = List([]);

  constructor(
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  ngOnInit() {
    this.page = environment.values.cms.home;

    this.securityApi
      .getAuthTrigger()
      .pipe(
        flatMap(() => {
          return this.projectApi.filter({ paging: { items: 3 } });
        }),
        map((data: Project[]) => {
          return List(data.map(project => project.getCard()));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards: List<Card>) => {
          this.projectList = cards;
        },
        (err: ApiErrorDetails) => {
          this.projectList = List([]);
        }
      );
  }
}
