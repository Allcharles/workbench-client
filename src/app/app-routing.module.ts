import { NgModule } from "@angular/core";
import { RouterModule, Routes, ROUTES } from "@angular/router";

import { environment } from "src/environments/environment";
import { HomeComponent } from "./component/home/home.component";

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  {
    path: "research",
    children: [
      { path: "about", redirectTo: "https://research.ecosounds.org/" },
      {
        path: "articles",
        redirectTo: "https://research.ecosounds.org/articles.html"
      },
      {
        path: "resources",
        redirectTo: "https://research.ecosounds.org/resources.html"
      },
      {
        path: "people",
        redirectTo: "https://research.ecosounds.org/people/people.html"
      },
      {
        path: "publications",
        redirectTo:
          "https://research.ecosounds.org/publications/publications.html"
      }
    ]
  }
];

export function getConfigRoutes() {
  return routes;
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: environment.routerEnableTracing
    })
  ],
  providers: [
    {
      provide: ROUTES,
      multi: true,
      useFactory: getConfigRoutes,
      useValue: {}
    }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
