import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User, UserInterface } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends ModelService<User> {
  private paths: {
    [key: string]: string;
  };

  constructor(http: HttpClient, config: AppConfigService) {
    const classBuilder = (user: UserInterface) => new User(user);
    super(http, config, classBuilder);

    this.paths = {
      myAccount: "/my_account",
      userAccount: "/user_accounts/:userId"
    };
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  public getMyAccount(): Subject<User> {
    return this.show(this.paths.myAccount, null);
  }

  /**
   * Get the user account details of another user
   * @param userId User ID
   * @returns Observable returning user details
   */
  public getUserAccount(userId: ID): Subject<User> {
    return this.show(this.paths.userAccount, null, userId);
  }
}
