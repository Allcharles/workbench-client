import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";
import { ProjectsService } from "./projects.service";

describe("ProjectsService", () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  const errorResponse = {
    status: 401,
    message: "Unauthorized"
  } as ApiErrorDetails;

  const errorInfoResponse = {
    status: 422,
    message: "Record could not be saved",
    info: {
      name: ["has already been taken"],
      image: [],
      image_file_name: [],
      image_file_size: [],
      image_content_type: [],
      image_updated_at: []
    }
  } as ApiErrorDetails;

  function createError(
    func:
      | "apiList"
      | "apiFilter"
      | "apiShow"
      | "apiCreate"
      | "apiUpdate"
      | "apiDestroy",
    url: string,
    error: ApiErrorDetails
  ) {
    spyOn<any>(service as any, func).and.callFake((path: string) => {
      expect(path).toBe(url);
      const subject = new Subject();

      setTimeout(() => {
        subject.error(error);
      }, 50);

      return subject;
    });
  }

  const shouldNotSucceed = () => {
    fail("Service should not produce a data output");
  };

  const shouldNotFail = () => {
    fail("Service should not produce an error");
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService }
      ]
    });

    service = TestBed.get(ProjectsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("list", () => {
    function createSuccess(path: string, model: Project[]) {
      return spyOn(service as any, "apiList").and.callFake((_path: string) => {
        expect(_path).toBe(path);

        const subject = new Subject<Project[]>();

        setTimeout(() => {
          subject.next(model);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should call apiList", () => {
      const models = [];
      const spy = createSuccess("/projects/", models);
      service.list().subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/");
    });

    it("should handle empty response", fakeAsync(() => {
      const models = [];

      createSuccess("/projects/", models);

      service.list().subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single project", fakeAsync(() => {
      const models = [
        new Project({
          id: 1,
          name: "name"
        })
      ];

      createSuccess("/projects/", models);

      service.list().subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple projects", fakeAsync(() => {
      const models = [
        new Project({
          id: 1,
          name: "name"
        }),
        new Project({
          id: 5,
          name: "name"
        })
      ];

      createSuccess("/projects/", models);

      service.list().subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiList", "/projects/", errorResponse);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiList", "/projects/", errorInfoResponse);

      service.list().subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
      });

      tick(100);
    }));
  });

  describe("filter", () => {
    function createSuccess(path: string, filters: Filters, models: Project[]) {
      return spyOn(service as any, "apiFilter").and.callFake(
        (_path: string, _filters: Filters) => {
          expect(_path).toBe(path);
          expect(_filters).toBe(filters);

          const subject = new Subject<Project[]>();

          setTimeout(() => {
            subject.next(models);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiFilter", () => {
      const filters = {} as Filters;
      const models = [];
      const spy = createSuccess("/projects/filter", filters, models);
      service.filter(filters).subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/filter", filters);
    });

    it("should handle empty filter response", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [];

      createSuccess("/projects/filter", filters, models);

      service.filter(filters).subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle single project", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [
        new Project({
          id: 1,
          name: "name"
        })
      ];

      createSuccess("/projects/filter", filters, models);

      service.filter(filters).subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle multiple projects", fakeAsync(() => {
      const filters = {} as Filters;
      const models = [
        new Project({
          id: 1,
          name: "name"
        }),
        new Project({
          id: 5,
          name: "name"
        })
      ];

      createSuccess("/projects/filter", filters, models);

      service.filter(filters).subscribe((_models: Project[]) => {
        expect(_models).toBeTruthy();
        expect(_models).toEqual(models);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/projects/filter", errorResponse);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const filters = {} as Filters;
      createError("apiFilter", "/projects/filter", errorInfoResponse);

      service
        .filter(filters)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
        });

      tick(100);
    }));

    // TODO Add tests for various types of filters
  });

  describe("show", () => {
    function createSuccess(url: string, output: Project) {
      return spyOn(service as any, "apiShow").and.callFake((path: string) => {
        expect(path).toBe(url);

        const subject = new Subject<Project>();

        setTimeout(() => {
          subject.next(output);
          subject.complete();
        }, 50);

        return subject;
      });
    }

    it("should call apiShow", () => {
      const model = new Project({
        id: 1,
        name: "name"
      });
      const spy = createSuccess("/projects/1", model);
      service.show(model).subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/1");
    });

    it("should handle project input", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createSuccess("/projects/1", model);

      service.show(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project id input", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createSuccess("/projects/1", model);

      service.show(1).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project model id", fakeAsync(() => {
      const model = new Project({
        id: 5,
        name: "name"
      });

      createSuccess("/projects/5", model);

      service.show(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      const model = new Project({
        id: 5,
        name: "name"
      });

      createSuccess("/projects/5", model);

      service.show(5).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiShow", "/projects/1", errorResponse);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiShow", "/projects/1", errorInfoResponse);

      service.show(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
      });

      tick(100);
    }));
  });

  describe("create", () => {
    function createSuccess(path: string, model: Project) {
      return spyOn(service as any, "apiCreate").and.callFake(
        (_path: string, _model: object) => {
          expect(_path).toBe(path);
          expect(_model).toEqual(model);

          const subject = new Subject<Project>();

          setTimeout(() => {
            subject.next(model);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiCreate", () => {
      const model = new Project({
        id: 1,
        name: "name"
      });
      const spy = createSuccess("/projects/", model);
      service.create(model).subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/", model);
    });

    it("should handle response", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createSuccess("/projects/", model);

      service.create(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with name", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "Custom Name"
      });

      createSuccess("/projects/", model);

      service.create(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with description", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name",
        description: "Custom Description"
      });

      createSuccess("/projects/", model);

      service.create(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    // TODO Write tests for all input types

    it("should handle error", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createError("apiCreate", "/projects/", errorResponse);

      service
        .create(model)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createError("apiCreate", "/projects/", errorInfoResponse);

      service
        .create(model)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
        });

      tick(100);
    }));
  });

  describe("update", () => {
    function createSuccess(path: string, model: Project) {
      return spyOn(service as any, "apiUpdate").and.callFake(
        (_path: string, _model: object) => {
          expect(_path).toBe(path);
          expect(_model).toEqual(model);

          const subject = new Subject<Project>();

          setTimeout(() => {
            subject.next(model);
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiUpdate", () => {
      const model = new Project({
        id: 1
      });
      const spy = createSuccess("/projects/1", model);
      service.update(model).subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/1", model);
    });

    it("should handle response", fakeAsync(() => {
      const model = new Project({
        id: 1
      });

      createSuccess("/projects/1", model);

      service.update(model).subscribe(
        (_model: Project) => {
          expect(_model).toBeTruthy();
          expect(_model).toEqual(model);
        },
        () => {
          expect(true).toBeFalsy("Service should not return an error");
        }
      );

      tick(100);
    }));

    it("should handle random project id", fakeAsync(() => {
      const model = new Project({
        id: 5
      });

      createSuccess("/projects/5", model);

      service.update(model).subscribe(
        (_model: Project) => {
          expect(_model).toBeTruthy();
          expect(_model).toEqual(model);
        },
        () => {
          expect(true).toBeFalsy("Service should not return an error");
        }
      );

      tick(100);
    }));

    it("should handle response with name", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "Custom Name"
      });

      createSuccess("/projects/1", model);

      service.update(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with description", fakeAsync(() => {
      const model = new Project({
        id: 1,
        description: "Custom Description"
      });

      createSuccess("/projects/1", model);

      service.update(model).subscribe((_model: Project) => {
        expect(_model).toBeTruthy();
        expect(_model).toEqual(model);
      }, shouldNotFail);

      tick(100);
    }));

    // TODO Write tests for all input types

    it("should handle error", fakeAsync(() => {
      const model = new Project({
        id: 1
      });

      createError("apiUpdate", "/projects/1", errorResponse);

      service
        .update(model)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorResponse);
        });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      const model = new Project({
        id: 1
      });

      createError("apiUpdate", "/projects/1", errorInfoResponse);

      service
        .update(model)
        .subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toBeTruthy();
          expect(err).toEqual(errorInfoResponse);
        });

      tick(100);
    }));
  });

  describe("destroy", () => {
    function createSuccess(path: string) {
      return spyOn(service as any, "apiDestroy").and.callFake(
        (_path: string) => {
          expect(_path).toBe(path);

          const subject = new Subject<void>();

          setTimeout(() => {
            subject.next();
            subject.complete();
          }, 50);

          return subject;
        }
      );
    }

    it("should call apiDestroy", () => {
      const model = new Project({
        id: 1,
        name: "name"
      });
      const spy = createSuccess("/projects/1");
      service.destroy(model).subscribe();
      expect(spy).toHaveBeenCalledWith("/projects/1");
    });

    it("should handle project input", fakeAsync(() => {
      const model = new Project({
        id: 1,
        name: "name"
      });

      createSuccess("/projects/1");

      service.destroy(model).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle project id input", fakeAsync(() => {
      createSuccess("/projects/1");

      service.destroy(1).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle response with random project id", fakeAsync(() => {
      createSuccess("/projects/5");

      service.destroy(5).subscribe(() => {
        expect(true).toBeTruthy();
      }, shouldNotFail);

      tick(100);
    }));

    it("should handle error", fakeAsync(() => {
      createError("apiDestroy", "/projects/1", errorResponse);

      service.destroy(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorResponse);
      });

      tick(100);
    }));

    it("should handle error with info", fakeAsync(() => {
      createError("apiDestroy", "/projects/1", errorInfoResponse);

      service.destroy(1).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual(errorInfoResponse);
      });

      tick(100);
    }));
  });
});
