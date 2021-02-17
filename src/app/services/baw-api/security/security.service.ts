import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { param } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { SessionUser, User } from "@models/User";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ApiErrorDetails } from "../api.interceptor.service";
import { apiReturnCodes, BawApiService } from "../baw-api.service";
import { UserService } from "../user/user.service";

const signUpSeed = stringTemplate`/my_account/sign_up/`;
const signUpEndpoint = stringTemplate`/my_account/`;
const signInEndpoint = stringTemplate`/my_account/sign_in/`;
const signOutEndpoint = stringTemplate`/security/`;
const sessionUserEndpoint = stringTemplate`/security/user?antiCache=${param}`;

/**
 * Security Service.
 * Handles API routes pertaining to security.
 */
@Injectable()
export class SecurityService extends BawApiService<SessionUser> {
  private authTrigger = new BehaviorSubject<void>(null);
  private handleError = (
    err: ApiErrorDetails | Error
  ): ObservableInput<any> => {
    this.clearData();

    if (err instanceof Error) {
      return throwError({
        status: apiReturnCodes.unknown,
        message: err.message,
      } as ApiErrorDetails);
    }
    return throwError(err);
  };

  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    private userService: UserService,
    private cookies: CookieService,
    injector: Injector
  ) {
    super(http, apiRoot, SessionUser, injector);
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<void> {
    return this.authTrigger;
  }

  /**
   * Returns the recaptcha seed for the registration form
   */
  public signUpSeed(): Observable<string> {
    return this.formHtmlRequest(signUpSeed()).pipe(
      // Extract token from page
      map((page: string) =>
        page.match(
          /id="g-recaptcha-response-data-register" data-sitekey="(.+?)"/
        )
      ),
      // Return token if exists
      map((token: RegExpMatchArray) => {
        if (isInstantiated(token?.[1])) {
          return token[1];
        }
        throw new Error(
          "Unable to retrieve recaptcha seed for registration request"
        );
      }),
      // Handle errors
      catchError(this.handleError)
    );
  }

  /**
   * Sign up the user
   *
   * @param details Details provided by registration form
   */
  public signUp(details: RegisterDetails): Observable<void> {
    return this.handleAuth(signUpSeed(), signUpEndpoint(), (page: string) => {
      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (!isInstantiated(token?.[1])) {
        throw new Error(
          "Unable to retrieve authenticity token for sign up request"
        );
      }

      // Set form data
      const body = new URLSearchParams();
      body.set("user[user_name]", details.userName);
      body.set("user[email]", details.email);
      body.set("user[password]", details.password);
      body.set("user[password_confirmation]", details.passwordConfirmation);
      body.set("commit", "Register");
      body.set("authenticity_token", token[1]);
      body.set("g-recaptcha-response-data[register]", details.recaptchaToken);
      body.set("g-recaptcha-response", "");
      return body;
    });
  }

  /**
   * Login the user
   *
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<void> {
    return this.handleAuth(
      signInEndpoint(),
      signInEndpoint(),
      (page: string) => {
        // Extract auth token if exists
        const token = page.match(/name="authenticity_token" value="(.+?)"/);
        if (!isInstantiated(token?.[1])) {
          throw new Error(
            "Unable to retrieve authenticity token for sign in request"
          );
        }

        // Set form data
        const body = new URLSearchParams();
        body.set("user[login]", details.login);
        body.set("user[password]", details.password);
        body.set("user[remember_me]", "0");
        body.set("commit", "Log+in");
        body.set("authenticity_token", token[1]);
        return body;
      }
    );
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut(): Observable<void> {
    return this.apiDestroy(signOutEndpoint()).pipe(
      tap(() => this.clearData()),
      catchError(this.handleError)
    );
  }

  /**
   * Handle authentication request
   *
   * @param formEndpoint Endpoint to retrieve form html
   * @param authEndpoint Endpoint to sign in/sign up user, should set an auth cookie
   * @param getFormData Get form data to insert into api request
   */
  private handleAuth(
    formEndpoint: string,
    authEndpoint: string,
    getFormData: (page: string) => URLSearchParams
  ) {
    // Request form page
    return this.formHtmlRequest(formEndpoint).pipe(
      // Extract form data from login/registration form, and create request body
      map((page: string) => getFormData(page)),
      /*
       * Mimic a traditional form-based sign in/sign up to get a well-formed auth cookie
       * Needed because of:
       * - https://github.com/QutEcoacoustics/baw-server/issues/509
       * - https://github.com/QutEcoacoustics/baw-server/issues/424
       */
      mergeMap((formData: URLSearchParams) =>
        this.formDataRequest(this.getPath(authEndpoint), formData)
      ),
      // Trade the cookie for an API auth token (mimicking old baw-client)
      mergeMap(() => this.apiShow(sessionUserEndpoint(Date.now().toString()))),
      // Save to local storage
      tap((user: SessionUser) => this.storeLocalUser(user)),
      // Get user details
      mergeMap(() => this.userService.show()),
      // Update session user with user details and save to local storage
      tap((user: User) =>
        this.storeLocalUser(
          new SessionUser({ ...this.getLocalUser(), ...user.toJSON() })
        )
      ),
      // Trigger auth observable
      tap(() => this.authTrigger.next(null)),
      // Handle errors
      catchError(this.handleError)
    );
  }

  /**
   * Clear session and cookie data, then trigger authTrigger
   */
  private clearData() {
    this.clearSessionUser();
    this.cookies.deleteAll();
    this.authTrigger.next(null);
  }

  /**
   * Request a HTML page from the API. This will be used to extract important
   * information required to make form-based requests later on
   */
  private formHtmlRequest(path: string): Observable<string> {
    return this.http.get(this.getPath(path), { responseType: "text" }).pipe(
      // Throw error if api response has not returned a html page
      map((page: any) => {
        if (typeof page !== "string") {
          throw new Error("Failed to retrieve auth form.");
        }
        return page;
      })
    );
  }

  /**
   * Use the form-based request to authenticate. The server will issue a
   * traditional session cookie which we can later trade for an auth token
   *
   * @param path API route path
   * @param formData API body
   */
  private formDataRequest(
    path: string,
    formData: URLSearchParams
  ): Observable<string> {
    return this.http.post(path, formData.toString(), {
      responseType: "text",
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "text/html",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
  }
}

export interface ILoginDetails {
  login?: string;
  password?: string;
}

export class LoginDetails extends AbstractModel implements ILoginDetails {
  public readonly kind = "LoginDetails";
  @bawPersistAttr
  public readonly login: string;
  @bawPersistAttr
  public readonly password: string;

  public constructor(details: ILoginDetails) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}

export interface IRegisterDetails {
  userName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  recaptchaToken: string;
}

export class RegisterDetails extends AbstractModel implements IRegisterDetails {
  public readonly kind = "RegisterDetails";
  @bawPersistAttr
  public readonly userName: string;
  @bawPersistAttr
  public readonly email: string;
  @bawPersistAttr
  public readonly password: string;
  @bawPersistAttr
  public readonly passwordConfirmation: string;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public constructor(details: IRegisterDetails) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}
