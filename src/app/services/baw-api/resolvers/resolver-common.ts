import {
  ActivatedRouteSnapshot,
  ParamMap,
  Resolve,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiErrorDetails } from "../api.interceptor.service";

export class ListResolver<T extends AbstractModel>
  implements Resolve<T[] | ApiErrorDetails> {
  constructor(
    private api: any,
    private router: Router,
    private getIds: (params: ParamMap) => Id[]
  ) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T[]> {
    const ids = this.getIds(route.paramMap);

    return this.api.list(...ids).pipe(
      take(1),
      catchError((err: ApiErrorDetails) => {
        console.error("Api Error: ", err);
        return of(err);
      })
    );
  }
}

export class ShowResolver<T extends AbstractModel>
  implements Resolve<T | ApiErrorDetails> {
  constructor(
    private api: any,
    private router: Router,
    private getIds: (params: ParamMap) => Id[]
  ) {}

  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> {
    const ids = this.getIds(route.paramMap);

    return this.api.show(...ids).pipe(
      take(1),
      catchError((err: ApiErrorDetails) => {
        console.error("Api Error: ", err);
        return of(err);
      })
    );
  }
}
