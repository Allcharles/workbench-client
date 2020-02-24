import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { ActionMenuComponent } from "src/app/component/shared/action-menu/action-menu.component";
import { SecondaryMenuComponent } from "src/app/component/shared/secondary-menu/secondary-menu.component";
import { getPageInfo } from "./pageComponent";
import { ErrorHandlerComponent } from "src/app/component/shared/error-handler/error-handler.component";

/**
 * Dynamically create routes for an angular component
 * @param page Angular component page info
 * @returns List of routes
 */
export function GetRouteConfigForPage(
  component: Type<any>,
  config: Partial<Route>
) {
  const page = getPageInfo(component);

  if (!page) {
    return;
  }

  Object.assign(config, {
    // data is inherited in child routes
    data: page,
    resolve: page.resolvers ? page.resolvers : {},
    children: [
      {
        path: "",
        pathMatch: "full",
        component: page.component
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "secondary",
        component: SecondaryMenuComponent
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "action",
        component: ActionMenuComponent
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "error",
        component: ErrorHandlerComponent
      }
    ]
  } as Partial<Route>);
}
