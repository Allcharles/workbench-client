import { TestBed } from "@angular/core/testing";
import { DataRequestService } from "./data-request.service";

//TODO
xdescribe("DataRequestService", () => {
  let service: DataRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataRequestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
