import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "src/app/interfaces/layout-menus.interfaces";
import { BawApiService, ErrorResponse, Paths } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  protected paths: Paths;
  protected loggedInTrigger = new BehaviorSubject<boolean>(false);

  constructor(http: HttpClient) {
    super(http);

    this.loggedInTrigger.next(this.isLoggedIn());

    this.paths = {
      security: {
        register: "/security",
        signIn: "/security",
        signOut: "/security"
      }
    };
  }

  /**
   * Returns an observable which tracks the change in loggedIn status
   */
  getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  register(details: any): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (this.isLoggedIn()) {
      subject.next("You are already logged in, try logging out first.");
    }

    this.post<AuthenticationLogin>(
      this.paths.security.register,
      undefined,
      details
    ).subscribe(
      (data: AuthenticationLogin) => {
        this.handleLoginResponse(subject, data);
      },
      (err: ErrorResponse) => {
        this.handleLoginError(subject, err);
      }
    );

    return subject.asObservable();
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in. Details are retrieved directly from the
   * login form template so that changes to the api are reflected
   * here without update.
   * @param details Details provided by login form
   * @returns Observable (true if success, error string if failure)
   */
  login(details: any): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (this.isLoggedIn()) {
      subject.next("You are already logged in, try logging out first.");
    }

    this.post<AuthenticationLogin>(
      this.paths.security.signIn,
      undefined,
      details
    ).subscribe(
      (data: AuthenticationLogin) => {
        this.handleLoginResponse(subject, data);
      },
      (err: ErrorResponse) => {
        this.handleLoginError(subject, err);
      }
    );

    return subject.asObservable();
  }

  /**
   * Handle failed API response
   * TODO Check subject is updated in caller
   * @param subject Observable subject
   * @param err API response
   */
  private handleLoginError(
    subject: Subject<boolean | string>,
    err: ErrorResponse
  ) {
    const data = err.error;
    if (data.meta.error.details) {
      subject.next(data.meta.error.details);
      this.loggedInTrigger.next(false);
    } else {
      this.logUnknownError(subject, err);
    }
  }

  /**
   * Handle successful API response
   * TODO Check subject is updated in caller
   * @param subject Observable subject
   * @param data API response
   */
  private handleLoginResponse(
    subject: Subject<boolean | string>,
    data: AuthenticationLogin
  ) {
    if (data.meta.status === this.RETURN_CODE.SUCCESS) {
      // TODO Read id and role from api
      this.setSessionUser({
        id: 12345,
        role: "User",
        authToken: data.data.authToken,
        username: data.data.userName
      });

      // Trigger login trackers
      this.loggedInTrigger.next(true);
      subject.next(true);
    } else {
      this.logUnknownError(subject, data);
    }
  }

  /**
   * Log unknown error message
   * @param err Error
   */
  private logUnknownError(subject: Subject<boolean | string>, err: any) {
    console.error("Unknown error thrown by login rest api");
    console.error(err);
    subject.next(
      "An unknown error has occurred. Please refresh the browser or try again at a later date."
    );

    this.loggedInTrigger.next(false);
  }

  /**
   * Logout user and clear session storage values
   */
  logout() {
    if (!this.isLoggedIn()) {
      return;
    }

    this.clearSessionStorage();

    // Trigger login trackers
    this.loggedInTrigger.next(false);
  }

  /**
   * Add user details to the session storage
   * @param user User details
   */
  private setSessionUser(user: User) {
    sessionStorage.setItem(this.SESSION_STORAGE.user, JSON.stringify(user));
  }

  /**
   * Clear session storage
   */
  private clearSessionStorage() {
    for (const key in this.SESSION_STORAGE) {
      sessionStorage.removeItem(this.SESSION_STORAGE[key]);
    }
  }
}

/**
 * Login interface
 */
interface AuthenticationLogin {
  meta: {
    message: string;
    status: number;
  };
  data: {
    authToken: string;
    message: string;
    userName: string;
  };
}
