import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { ContactUsComponent } from "./contact-us.component";

describe("ContactUsComponent", () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, MockAppConfigModule],
      declarations: [ContactUsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
