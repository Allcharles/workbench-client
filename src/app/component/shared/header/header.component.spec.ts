/// <reference types="karma-viewport" />

import { HttpClientModule } from "@angular/common/http";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { User } from "src/app/models/User";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { testBawServices } from "src/app/test.helper";
import { contactUsMenuItem } from "../../about/about.menus";
import { adminDashboardMenuItem } from "../../admin/admin.menus";
import { homeMenuItem } from "../../home/home.menus";
import { myAccountMenuItem } from "../../profile/profile.menus";
import { projectsMenuItem } from "../../projects/projects.menus";
import { loginMenuItem, registerMenuItem } from "../../security/security.menus";
import { SharedModule } from "../shared.module";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let securityApi: SecurityService;
  let userApi: UserService;
  let env: AppConfigService;
  let router: Router;

  function setUser(isLoggedIn: boolean, user?: User) {
    if (isLoggedIn) {
      spyOn(userApi, "show").and.callFake(() => {
        return new BehaviorSubject<User>(user);
      });
    }

    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return isLoggedIn;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
  }

  function assertRouterLink(element: HTMLElement, route: string) {
    expect(
      element.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      element.attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe(route);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderItemComponent,
        HeaderDropdownComponent
      ],
      imports: [SharedModule, RouterTestingModule, HttpClientModule],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    securityApi = TestBed.inject(SecurityService);
    userApi = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;

    viewport.set("extra-large");
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    setUser(false);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe("links", () => {
    const userRoles = [
      {
        type: "guest",
        links: {
          register: true,
          login: true,
          profile: false,
          logout: false,
          admin: false
        }
      },
      {
        type: "logged in",
        links: {
          register: false,
          login: false,
          profile: true,
          logout: true,
          admin: false
        }
      },
      {
        type: "admin",
        links: {
          register: false,
          login: false,
          profile: true,
          logout: true,
          admin: true
        }
      }
    ];

    userRoles.forEach(userType => {
      describe(userType.type + " user", () => {
        let isLoggedIn: boolean;
        let user: User;

        beforeEach(() => {
          if (userType.type === "guest") {
            isLoggedIn = false;
            user = undefined;
          } else {
            isLoggedIn = true;
            user = new User({
              id: 1,
              userName: "Username",
              rolesMask: userType.type === "admin" ? 1 : 2,
              rolesMaskNames: userType.type === "user" ? ["user"] : ["admin"]
            });
          }
        });

        it("should create brand name link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const brand = fixture.nativeElement.querySelector("a.navbar-brand");
          expect(brand).toBeTruthy();
          expect(brand.innerText).toContain(env.values.brand.name);
          assertRouterLink(brand, homeMenuItem.route.toString());
        });

        it("should create projects link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[0];
          expect(link).toBeTruthy();
          expect(link.innerText).toContain(projectsMenuItem.label);
          assertRouterLink(link, projectsMenuItem.route.toString());
        });

        it("should create contact us link", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[2];
          expect(link).toBeTruthy();
          expect(link.innerText).toContain(contactUsMenuItem.label);
          assertRouterLink(link, contactUsMenuItem.route.toString());
        });

        it("should create header links from external config", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const link = fixture.nativeElement.querySelectorAll("a.nav-link")[1];
          expect(link).toBeTruthy();
          expect(link.innerText).toContain("<< content1 >>");
        });

        it("should create header dropdown links from external config", () => {
          setUser(isLoggedIn, user);
          fixture.detectChanges();

          const dropdown = fixture.nativeElement.querySelector(
            "app-header-dropdown"
          );
          expect(dropdown).toBeTruthy();
          expect(
            dropdown.querySelector("button#dropdownBasic").innerText.trim()
          ).toBe("<< content2 >>");
          expect(dropdown.querySelectorAll(".dropdown-item").length).toBe(2);
        });

        it(
          "should" +
            (!userType.links.register ? " not" : "") +
            " display register link",
          () => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const link = fixture.nativeElement.querySelector(
              "#register-header-link"
            );

            if (userType.links.register) {
              expect(link).toBeTruthy();
              expect(link.innerText).toContain(registerMenuItem.label);
              assertRouterLink(link, registerMenuItem.route.toString());
            } else {
              expect(link).toBeFalsy();
            }
          }
        );

        it(
          "should" +
            (!userType.links.login ? " not" : "") +
            " display login link",
          () => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const link = fixture.nativeElement.querySelector(
              "#login-header-link"
            );

            if (userType.links.login) {
              expect(link).toBeTruthy();
              expect(link.innerText).toContain(loginMenuItem.label);
              assertRouterLink(link, loginMenuItem.route.toString());
            } else {
              expect(link).toBeFalsy();
            }
          }
        );

        it(
          "should" +
            (!userType.links.profile ? " not" : "") +
            " display profile name",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );

            if (userType.links.profile) {
              expect(profile).toBeTruthy();
              expect(profile.innerText.trim()).toBe("Username");
              assertRouterLink(profile, myAccountMenuItem.route.toString());
            } else {
              expect(profile).toBeFalsy();
            }
          })
        );

        if (userType.links.profile) {
          it("should display profile icon", fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );
            expect(profile).toBeTruthy();

            const icon = profile.querySelector("img");
            expect(icon).toBeTruthy();
            expect(icon.alt).toBe("Profile Icon");
            expect(icon.src).toBe(
              `http://${window.location.host}/assets/images/user/user_span1.png`
            );
          }));

          it("should display profile custom icon", fakeAsync(() => {
            const customUser = new User({
              ...user,
              imageUrls: [
                {
                  size: "extralarge",
                  url: "http://brokenlink/",
                  width: 300,
                  height: 300
                },
                {
                  size: "large",
                  url: "http://brokenlink/",
                  width: 220,
                  height: 220
                },
                {
                  size: "medium",
                  url: "http://brokenlink/",
                  width: 140,
                  height: 140
                },
                {
                  size: "small",
                  url: "http://brokenlink/",
                  width: 60,
                  height: 60
                },
                {
                  size: "tiny",
                  url: "http://brokenlink/",
                  width: 30,
                  height: 30
                }
              ]
            });
            setUser(isLoggedIn, customUser);
            fixture.detectChanges();

            const profile = fixture.nativeElement.querySelector(
              "#login-widget"
            );
            expect(profile).toBeTruthy();

            const icon = profile.querySelector("img");
            expect(icon).toBeTruthy();
            expect(icon.alt).toBe("Profile Icon");
            expect(icon.src).toBe("http://brokenlink/");
          }));
        }

        it(
          "should" + (!userType.links.logout ? " not" : "") + " display logout",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const logout = fixture.nativeElement.querySelectorAll(
              "button.nav-link"
            )[1];

            if (userType.links.logout) {
              expect(logout).toBeTruthy();
              expect(logout.innerText.trim()).toBe("Logout");
            } else {
              expect(logout).toBeFalsy();
            }
          })
        );

        it(
          "should" +
            (!userType.links.admin ? " not" : "") +
            " display admin settings",
          fakeAsync(() => {
            setUser(isLoggedIn, user);
            fixture.detectChanges();

            const settings = fixture.nativeElement.querySelector(
              "#admin-settings"
            );

            if (userType.links.admin) {
              expect(settings).toBeTruthy();
              assertRouterLink(
                settings,
                adminDashboardMenuItem.route.toString()
              );
            } else {
              expect(settings).toBeFalsy();
            }
          })
        );
      });
    });
  });

  describe("logout", () => {
    it("should call signOut when logout button pressed", fakeAsync(() => {
      setUser(
        true,
        new User({
          id: 1,
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00"
        })
      );
      spyOn(securityApi, "signOut").and.callFake(() => {
        return new BehaviorSubject<void>(null);
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      expect(securityApi.signOut).toHaveBeenCalled();
    }));

    it("should redirect to home page when logout successful", fakeAsync(() => {
      setUser(
        true,
        new User({
          id: 1,
          userName: "custom username",
          rolesMask: 2,
          rolesMaskNames: ["user"],
          lastSeenAt: "2019-12-18T11:16:08.233+10:00"
        })
      );
      spyOn(securityApi, "signOut").and.callFake(() => {
        const subject = new Subject<void>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      expect(router.navigate).toHaveBeenCalledWith([
        homeMenuItem.route.toString()
      ]);
    }));

    // TODO Move to E2E Tests
    it("should display register after logout", fakeAsync(() => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      spyOn(securityApi, "isLoggedIn").and.callFake(() => {
        count++;
        return count === 1;
      });
      spyOn(securityApi, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(securityApi, "signOut").and.callFake(() => {
        const subject = new Subject<any>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      spyOn(userApi, "show").and.callFake(() => {
        return new BehaviorSubject<User>(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      // Wait for sign out, and trigger logged in status update
      loggedInTrigger.next(null);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelectorAll("a.nav-link")[3];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(registerMenuItem.label);
      assertRouterLink(link, registerMenuItem.route.toString());
    }));

    // TODO Move to E2E Tests
    it("should display login after logout", fakeAsync(() => {
      let count = 0;
      const loggedInTrigger = new BehaviorSubject(null);
      spyOn(securityApi, "isLoggedIn").and.callFake(() => {
        count++;
        return count === 1;
      });
      spyOn(securityApi, "getAuthTrigger").and.callFake(() => loggedInTrigger);
      spyOn(securityApi, "signOut").and.callFake(() => {
        const subject = new Subject<any>();
        subject.complete();
        return subject;
      });
      spyOn(router, "navigate").and.stub();
      spyOn(userApi, "show").and.callFake(() => {
        return new BehaviorSubject<User>(
          new User({
            id: 1,
            userName: "custom username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            lastSeenAt: "2019-12-18T11:16:08.233+10:00"
          })
        );
      });
      fixture.detectChanges();

      const logout = fixture.nativeElement.querySelectorAll(
        "button.nav-link"
      )[1];
      logout.click();

      // Wait for sign out, and trigger logged in status update
      loggedInTrigger.next(null);
      fixture.detectChanges();

      const link = fixture.nativeElement.querySelectorAll("a.nav-link")[4];
      expect(link).toBeTruthy();
      expect(link.innerText).toContain(loginMenuItem.label);
      assertRouterLink(link, loginMenuItem.route.toString());
    }));
  });

  describe("navbar collapsed logic", () => {
    it("should collapse at bootstrap md size", () => {
      setUser(false);
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("nav");
      let expandLgClass = false;
      navbar.classList.forEach((className: string) => {
        if (className === "navbar-expand-lg") {
          expandLgClass = true;
        }
      });
      expect(expandLgClass).toBeTrue();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      expect(button).toBeTruthy();
    });

    it("navbar should initially be collapsed", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeTruthy();
    });

    it("navbar should open on toggle button press", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      expect(button).toBeTruthy();
      button.click();

      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeFalsy();
    });

    it("navbar should close on toggle button press", () => {
      viewport.set("medium");
      setUser(false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        "button.navbar-toggler"
      );
      expect(button).toBeTruthy();
      button.click();
      fixture.detectChanges();

      button.click();
      fixture.detectChanges();

      const navbar = fixture.nativeElement.querySelector("div.collapse");
      expect(navbar).toBeTruthy();
    });

    xit("navbar should close on navigation", () => {});
  });
});
