import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IdOr } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { SessionUser } from "@models/User";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { generateSessionUser } from "@test/fakes/User";
import {
  validateApiCreate,
  validateApiDestroy,
  validateApiFilter,
  validateApiList,
  validateApiShow,
  validateApiUpdate,
  validateCustomApiFilter,
} from "@test/helpers/api-common";
import { modelData } from "@test/helpers/faker";
import { SitesService } from "./sites.service";

type Model = Site;
type Params = [IdOr<Project>];
type Service = SitesService;

describe("SitesService", function () {
  const createModel = () => new Site(generateSite(10));
  const baseUrl = "/projects/5/sites/";
  let service: SitesService;
  let apiRoot: string;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
      providers: [SitesService],
    });

    service = TestBed.inject(SitesService);
    apiRoot = TestBed.inject(API_ROOT);
    this.service = service;
  });

  validateApiList<Model, Params, Service>(baseUrl, 5);
  validateApiFilter<Model, Params, Service>(baseUrl + "filter", 5);
  validateApiShow<Model, Params, Service>(baseUrl + "10", 10, createModel, 5);
  validateApiCreate<Model, Params, Service>(baseUrl, createModel, 5);
  validateApiUpdate<Model, Params, Service>(baseUrl + "10", createModel, 5);
  validateApiDestroy<Model, Params, Service>(
    baseUrl + "10",
    10,
    createModel,
    5
  );

  validateCustomApiFilter<Model, [...Params, IdOr<Region>], Service>(
    baseUrl + "filter",
    "filterByRegion",
    { filter: { regionId: { eq: 10 } } },
    undefined,
    5,
    10
  );

  describe("downloadAnnotations", () => {
    const defaultTimezone = "UTC";

    function setLoggedIn(authToken: string) {
      if (!authToken) {
        spyOn(service, "getLocalUser").and.callFake(() => null);
      } else {
        const user = new SessionUser({ ...generateSessionUser(), authToken });
        spyOn(service, "getLocalUser").and.callFake(() => user);
      }
    }

    function getUrl(timezone: string = defaultTimezone, token?: string) {
      const tokenQsp = token ? `&user_token=${token}` : "";
      return `${apiRoot}${baseUrl}10/audio_events/download?selected_timezone_name=${timezone}${tokenQsp}`;
    }

    it("should return url using model ids", () => {
      setLoggedIn(null);
      expect(service.downloadAnnotations(10, 5, defaultTimezone)).toBe(
        getUrl()
      );
    });

    it("should return url using model objects", () => {
      setLoggedIn(null);
      expect(
        service.downloadAnnotations(
          new Site(generateSite(10)),
          new Project(generateProject(5)),
          defaultTimezone
        )
      ).toBe(getUrl());
    });

    it("should return url with auth token appended", () => {
      const authToken = modelData.authToken();
      setLoggedIn(authToken);
      expect(service.downloadAnnotations(10, 5, defaultTimezone)).toBe(
        getUrl(defaultTimezone, authToken)
      );
    });

    it("should return url with timezone", () => {
      setLoggedIn(null);
      expect(service.downloadAnnotations(10, 5, "Brisbane")).toBe(
        getUrl("Brisbane")
      );
    });
  });
});
