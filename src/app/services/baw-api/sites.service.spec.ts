import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { Site } from "src/app/models/Site";
import { ApiCommon } from "./api-common";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";
import { MockApiCommon } from "./mock/api-commonMock";
import { MockBawApiService } from "./mock/baseApiMockService";
import { SitesService } from "./sites.service";

describe("SitesService", () => {
  let service: SitesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        { provide: BawApiService, useClass: MockBawApiService },
        { provide: ApiCommon, useClass: MockApiCommon }
      ]
    });

    service = TestBed.get(SitesService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /**
   * getSites
   */

  it("getSites should handle empty response", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSites().subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSites should handle single site", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSites().subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSites should handle multiple sites", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            }),
            new Site({
              id: 5,
              name: "Name",
              creatorId: 10,
              projectIds: new Set([10, 20, 30])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSites().subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          }),
          new Site({
            id: 5,
            name: "Name",
            creatorId: 10,
            projectIds: new Set([10, 20, 30])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSites should handle single site with empty filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toEqual({});
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSites({}).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSites should handle single site with filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toEqual({ paging: { items: 3 } });
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSites({ paging: { items: 3 } }).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSites should handle error", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getSites().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getSites should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
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
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getSites().subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * getSite
   */

  it("getSite should handle response", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSite(1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSite should handle response with random id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/5");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSite(5).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSite should handle response with empty filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/1");
        expect(filters).toEqual({});
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSite(1, {}).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSite should handle response with filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/1");
        expect(filters).toEqual({ paging: { items: 3 } });
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getSite(1, { paging: { items: 3 } }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getSite should handle error", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getSite(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getSite should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
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
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getSite(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * getProjectSite
   */

  it("getProjectSites should handle empty response", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle random project id", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/5/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(5).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle single site", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle multiple sites", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            }),
            new Site({
              id: 5,
              name: "Name",
              creatorId: 10,
              projectIds: new Set([10, 20, 30])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          }),
          new Site({
            id: 5,
            name: "Name",
            creatorId: 10,
            projectIds: new Set([10, 20, 30])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle single site with empty filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toEqual({});
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1, {}).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle single site with filter", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toEqual({ paging: { items: 3 } });
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.next([
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          ]);
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1, { paging: { items: 3 } }).subscribe(
      (sites: Site[]) => {
        expect(sites).toBeTruthy();
        expect(sites).toEqual([
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        ]);
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle error", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getProjectSites should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "list").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site[]>();

        setTimeout(() => {
          subject.error({
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
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjectSites(1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * getProjectSite
   */

  it("getProjectSite should handle response", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/5/sites/1");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(5, 1).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle response with random site id", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/5");
        expect(filters).toBeFalsy();
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 5).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle response with empty filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toEqual({});
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 1, {}).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle response with filter", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toEqual({ paging: { items: 3 } });
        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.next(
            new Site({
              id: 1,
              name: "Name",
              creatorId: 2,
              projectIds: new Set([1, 2, 3])
            })
          );
          subject.complete();
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 1, { paging: { items: 3 } }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([1, 2, 3])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle error", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();

        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
            status: 401,
            message: "Unauthorized"
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("getProjectSite should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "show").and.callFake(
      (path: string, filters: Filters) => {
        expect(path).toBe("/projects/1/sites/1");
        expect(filters).toBeFalsy();

        const subject = new Subject<Site>();

        setTimeout(() => {
          subject.error({
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
          } as APIErrorDetails);
        }, 50);

        return subject;
      }
    );

    service.getProjectSite(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * newProjectSite
   */

  it("newProjectSite should handle response", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.newProjectSite(1, { name: "Name" }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("newProjectSite should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/5/sites");
      expect(values).toEqual({ name: "Name" });
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.newProjectSite(5, { name: "Name" }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("newProjectSite should handle response with description", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name", description: "Description" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service
      .newProjectSite(1, { name: "Name", description: "Description" })
      .subscribe(
        (site: Site) => {
          expect(site).toBeTruthy();
          expect(site).toEqual(
            new Site({
              id: 1,
              name: "Name",
              description: "Description",
              creatorId: 2,
              projectIds: new Set([])
            })
          );
        },
        () => {
          expect(true).toBeFalsy("Service should not return an error");
        }
      );

    tick(100);
  }));

  xit("newProjectSite should handle response with image", fakeAsync(() => {}));
  xit("newProjectSite should handle response with location obfuscated", fakeAsync(() => {}));
  xit("newProjectSite should handle response with custom location", fakeAsync(() => {}));
  xit("newProjectSite should handle response with timezone information", fakeAsync(() => {}));
  xit("newProjectSite should handle response with all inputs", fakeAsync(() => {}));

  it("newProjectSite should handle error", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.newProjectSite(1, { name: "Name" }).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("newProjectSite should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "new").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
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
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.newProjectSite(1, { name: "Name" }).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * updateProjectSite
   */

  it("updateProjectSite should handle response", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual({});

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 1, {}).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProjectSite should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/5/sites/1");
      expect(values).toEqual({});
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.updateProjectSite(5, 1, {}).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProjectSite should handle response with random site id", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/5");
      expect(values).toEqual({});
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 5, {}).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProjectSite should handle response with name", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual({ name: "Name" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 1, { name: "Name" }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("updateProjectSite should handle response with description", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual({ description: "Description" });

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 1, { description: "Description" }).subscribe(
      (site: Site) => {
        expect(site).toBeTruthy();
        expect(site).toEqual(
          new Site({
            id: 1,
            name: "Name",
            description: "Description",
            creatorId: 2,
            projectIds: new Set([])
          })
        );
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  xit("updateProjectSite should handle response with image", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with location obfuscated", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with custom location", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with timezone information", fakeAsync(() => {}));
  xit("updateProjectSite should handle response with all inputs", fakeAsync(() => {}));

  it("updateProjectSite should handle error", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual({});

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 1, {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("updateProjectSite should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "update").and.callFake((path: string, values: any) => {
      expect(path).toBe("/projects/1/sites/1");
      expect(values).toEqual({});

      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.error({
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
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.updateProjectSite(1, 1, {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  /**
   * deleteProjectSite
   */

  it("deleteProjectSite should handle response", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.deleteProjectSite(1, 1).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("deleteProjectSite should handle response with random project id", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/5/sites/1");
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.deleteProjectSite(5, 1).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("deleteProjectSite should handle response with random site id", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/5");
      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.next(true);
        subject.complete();
      }, 50);

      return subject;
    });

    service.deleteProjectSite(1, 5).subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
      },
      () => {
        expect(true).toBeFalsy("Service should not return an error");
      }
    );

    tick(100);
  }));

  it("deleteProjectSite should handle error", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.deleteProjectSite(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));

  it("deleteProjectSite should handle error with info", fakeAsync(() => {
    spyOn<any>(service, "delete").and.callFake((path: string) => {
      expect(path).toBe("/projects/1/sites/1");

      const subject = new Subject<boolean>();

      setTimeout(() => {
        subject.error({
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
        } as APIErrorDetails);
      }, 50);

      return subject;
    });

    service.deleteProjectSite(1, 1).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not return data");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
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
        } as APIErrorDetails);
      }
    );

    tick(100);
  }));
});
