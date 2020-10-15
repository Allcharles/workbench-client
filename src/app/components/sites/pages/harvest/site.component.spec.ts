import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppConfigService } from "@services/app-config/app-config.service";
import { cmsRoot } from "@services/app-config/app-config.service.spec";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { SiteHarvestComponent } from "./site.component";

describe("SiteHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let component: SiteHarvestComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<SiteHarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, MockAppConfigModule],
      declarations: [SiteHarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHarvestComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(`${cmsRoot}/harvest.html`);
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(`${cmsRoot}/harvest.html`);

    req.flush(
      "<h1>Test Header</h1><p class='description'>Test Description</p>"
    );
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p.description");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  });
});