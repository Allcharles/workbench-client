import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { apiReturnCodes } from "@baw-api/baw-api.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { SharedModule } from "../shared.module";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<baw-error-handler [error]='error'></baw-error-handler>",
})
class MockComponent implements OnInit {
  public error: ApiErrorDetails;

  constructor(private ref: ChangeDetectorRef) {}

  public ngOnInit() {
    this.error = {
      status: 401,
      message: "You need to log in or register before continuing.",
    } as ApiErrorDetails;
    this.ref.detectChanges();
  }

  public setError(error: ApiErrorDetails) {
    this.error = error;
    this.ref.detectChanges();
  }
}

describe("ErrorHandlerComponent", () => {
  let component: ErrorHandlerComponent;
  let mockComponent: MockComponent;
  let fixture: ComponentFixture<ErrorHandlerComponent>;
  let mockFixture: ComponentFixture<MockComponent>;

  function assertTitle(
    title: string,
    nativeElement: any = fixture.nativeElement
  ) {
    const titleEl = nativeElement.querySelector("h1");

    if (!title) {
      expect(titleEl).toBeFalsy();
      return;
    }

    expect(titleEl).toBeTruthy();
    expect(titleEl.innerText.trim()).toBe(title);
  }

  function assertDescription(
    description: string,
    nativeElement: any = fixture.nativeElement
  ) {
    const bodyEl = nativeElement.querySelector("p");

    if (!description) {
      expect(bodyEl).toBeFalsy();
      return;
    }

    expect(bodyEl).toBeTruthy();
    expect(bodyEl.innerText).toBe(description);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, MockAppConfigModule],
      declarations: [ErrorHandlerComponent, MockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorHandlerComponent);
    mockFixture = TestBed.createComponent(MockComponent);

    component = fixture.componentInstance;
    mockComponent = mockFixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle unauthorized code", () => {
    component.error = generateApiErrorDetails("Unauthorized", {
      message: "You need to log in or register before continuing.",
    });
    fixture.detectChanges();

    assertTitle("Unauthorized Access");
    assertDescription("You need to log in or register before continuing.");
  });

  it("should handle not found code", () => {
    component.error = generateApiErrorDetails("Not Found", {
      message: "Could not find the requested item.",
    });
    fixture.detectChanges();

    assertTitle("Not Found");
    assertDescription("Could not find the requested item.");
  });

  it("should handle zero code", () => {
    component.error = generateApiErrorDetails("Custom", {
      status: 0,
      message: "Unknown error has occurred.",
    });
    fixture.detectChanges();

    assertTitle("Unknown Error");
    assertDescription("Unknown error has occurred.");
  });

  it("should handle unknown code", () => {
    component.error = generateApiErrorDetails("Custom", {
      status: apiReturnCodes.unknown,
      message: "Unknown error has occurred.",
    });
    fixture.detectChanges();

    assertTitle("Unknown Error");
    assertDescription("Unknown error has occurred.");
  });

  it("should handle undefined code", () => {
    component.error = undefined;
    fixture.detectChanges();

    assertTitle(undefined);
    assertDescription(undefined);
  });

  it("should handle null code", () => {
    component.error = null;
    fixture.detectChanges();

    assertTitle(undefined);
    assertDescription(undefined);
  });

  it("should detect changes", () => {
    mockFixture.detectChanges();

    const nativeElement = mockFixture.nativeElement;
    assertTitle("Unauthorized Access", nativeElement);
    assertDescription(
      "You need to log in or register before continuing.",
      nativeElement
    );

    mockComponent.setError(
      generateApiErrorDetails("Not Found", {
        message: "Could not find the requested item.",
      })
    );
    mockFixture.detectChanges();

    assertTitle("Not Found", nativeElement);
    assertDescription("Could not find the requested item.", nativeElement);
  });
});