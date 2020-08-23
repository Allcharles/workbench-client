import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Site } from "@models/Site";
import { SharedModule } from "@shared/shared.module";
import { generateSite } from "@test/fakes/Site";
import { assertPagination } from "@test/helpers/pagedTableTemplate";
import { appLibraryImports } from "src/app/app.module";
import { AdminOrphansComponent } from "./list.component";

describe("AdminOrphansComponent", () => {
  let api: ShallowSitesService;
  let defaultModel: Site;
  let defaultModels: Site[];
  let fixture: ComponentFixture<AdminOrphansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrphansComponent],
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminOrphansComponent);
    api = TestBed.inject(ShallowSitesService);

    defaultModel = new Site(generateSite());
    defaultModels = [];
    for (let i = 0; i < 25; i++) {
      defaultModels.push(new Site(generateSite()));
    }

    this.defaultModels = defaultModels;
    this.fixture = fixture;
    this.api = api;
  });

  // TODO Write Tests
  assertPagination<Site, ShallowSitesService>("orphanFilter");

  xdescribe("rows", () => {});
  xdescribe("actions", () => {});
});