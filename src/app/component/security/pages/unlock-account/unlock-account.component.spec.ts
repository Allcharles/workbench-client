import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { appLibraryImports } from "src/app/app.module";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testAppInitializer } from "src/app/test.helper";
import { UnlockPasswordComponent } from "./unlock-account.component";

describe("UnlockPasswordComponent", () => {
  let component: UnlockPasswordComponent;
  let fixture: ComponentFixture<UnlockPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule],
      declarations: [UnlockPasswordComponent, HomeComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.schema.model = {};
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load form", () => {
    expect(
      fixture.nativeElement.querySelector("button[type='submit']")
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector("button[type='submit']").disabled
    ).toBeFalsy();
  });

  it("should only contain one input", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(1);
  });

  it("should contain username/email input", () => {
    expect(fixture.nativeElement.querySelector("input")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("input").type).toBe("text");
  });

  it("username/email input should be required field", () => {
    expect(
      fixture.nativeElement.querySelectorAll("input")[0].required
    ).toBeTruthy();
  });

  it("username/email input should have email id", () => {
    expect(fixture.nativeElement.querySelectorAll("input")[0].id).toContain(
      "_input_email_"
    );
  });

  it("should not call submit function with missing email", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.nativeElement.querySelector("input");
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).not.toHaveBeenCalled();
  }));

  it("should show error message with missing email", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.nativeElement.querySelector("input");
    email.value = "";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();

    const msg = fixture.nativeElement.querySelector("ngb-alert");
    expect(msg).toBeTruthy();
    expect(msg.innerText.length).toBeGreaterThan(2); // Alert places a ' x' at the end of the message
  }));

  it("should call submit function on submit", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.nativeElement.querySelector("input");
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).toHaveBeenCalled();
  }));

  it("should call submit function with form details on submit", fakeAsync(() => {
    spyOn(component, "submit");

    const email = fixture.nativeElement.querySelector("input");
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const button = fixture.nativeElement.querySelector("button[type='submit']");
    button.click();

    tick();
    fixture.detectChanges();
    expect(component.submit).toHaveBeenCalledWith({ email: "email" });
  }));

  xit("should unlock account on submit", () => {});
});
