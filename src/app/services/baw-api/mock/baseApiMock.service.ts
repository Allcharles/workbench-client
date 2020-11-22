import { Injectable, Injector } from "@angular/core";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";

export class MockModel extends AbstractModel {
  public kind = "MockModel";
  public readonly id: Id;

  public constructor(raw: object, protected injector?: Injector) {
    super({ id: 1, ...raw }, injector);
  }

  public toJSON() {
    return { id: this.id };
  }

  public get viewUrl(): string {
    return "";
  }
}

@Injectable()
export class MockBawApiService {
  public constructor() {}

  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
