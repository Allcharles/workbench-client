import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppConfigService } from "@services/app-config/app-config.service";
import { cmsRoot } from "@services/app-config/app-config.service.spec";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { PointHarvestComponent } from "./point.component";

describe("PointHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let component: PointHarvestComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<PointHarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, MockAppConfigModule],
      declarations: [PointHarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PointHarvestComponent);
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