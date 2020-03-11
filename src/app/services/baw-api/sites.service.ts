import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, listMock } from "./mock/api-commonMock";
import { Resolvers } from "./resolver-common";

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;
const endpointShallow = stringTemplate`/sites/${siteId}${option}`;

@Injectable()
export class SitesService extends StandardApi<Site, [IdOr<Project>]> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Site);
  }

  list(project: IdOr<Project>): Observable<Site[]> {
    return this.apiList(endpoint(project, Empty, Empty));
  }
  filter(filters: Filters, project: IdOr<Project>): Observable<Site[]> {
    return this.apiFilter(endpoint(project, Empty, Filter), filters);
  }
  show(model: IdOr<Site>, project: IdOr<Project>): Observable<Site> {
    return this.apiShow(endpoint(project, model, Empty));
  }
  create(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiCreate(endpoint(project, Empty, Empty), model);
  }
  update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiUpdate(endpoint(project, model, Empty), model);
  }
  destroy(model: IdOr<Site>, project: IdOr<Project>): Observable<Site | void> {
    return this.apiDestroy(endpoint(project, model, Empty));
  }
}

@Injectable()
export class ShallowSitesService extends StandardApi<Site, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Site);
  }

  list(): Observable<Site[]> {
    return listMock<Site>(
      index =>
        new Site({
          id: index,
          name: "PLACEHOLDER SITE",
          description: "PLACEHOLDER DESCRIPTION",
          creatorId: 1
        })
    );
    // return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters): Observable<Site[]> {
    return filterMock<Site>(
      filters,
      index =>
        new Site({
          id: index,
          name: "PLACEHOLDER SITE",
          description: "PLACEHOLDER DESCRIPTION",
          creatorId: 1
        })
    );
    // return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<Site>): Observable<Site> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: Site): Observable<Site> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(model: Site): Observable<Site> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<Site>): Observable<Site | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}

export const siteResolvers = new Resolvers<Site, SitesService>(
  [SitesService],
  "siteId",
  ["projectId"]
).create("Site");

export const shallowSiteResolvers = new Resolvers<Site, ShallowSitesService>(
  [ShallowSitesService],
  "siteId"
).create("ShallowSite");
