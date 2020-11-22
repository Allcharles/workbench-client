import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetRouteConfigForPage } from '@helpers/page/pageRouting';
import { SharedModule } from '@shared/shared.module';
import { MyAnnotationsComponent } from './pages/annotations/my-annotations.component';
import { TheirAnnotationsComponent } from './pages/annotations/their-annotations.component';
import { MyBookmarksComponent } from './pages/bookmarks/my-bookmarks.component';
import { TheirBookmarksComponent } from './pages/bookmarks/their-bookmarks.component';
import { MyEditComponent } from './pages/my-edit/my-edit.component';
import { MyProfileComponent } from './pages/profile/my-profile.component';
import { TheirProfileComponent } from './pages/profile/their-profile.component';
import { MyProjectsComponent } from './pages/projects/my-projects.component';
import { TheirProjectsComponent } from './pages/projects/their-projects.component';
import { MySitesComponent } from './pages/sites/my-sites.component';
import { TheirSitesComponent } from './pages/sites/their-sites.component';
import { TheirEditComponent } from './pages/their-edit/their-edit.component';
import { myAccountRoute, theirProfileRoute } from './profile.menus';

const MyAccountComponents = [
  MyProfileComponent,
  MyEditComponent,
  MyProjectsComponent,
  MySitesComponent,
  MyBookmarksComponent,
  MyAnnotationsComponent,
];
const TheirProfileComponents = [
  TheirProfileComponent,
  TheirEditComponent,
  TheirProjectsComponent,
  TheirSitesComponent,
  TheirBookmarksComponent,
  TheirAnnotationsComponent,
];

const myAccountRoutes = myAccountRoute.compileRoutes(GetRouteConfigForPage);
const profileRoutes = theirProfileRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: MyAccountComponents,
  imports: [SharedModule, RouterModule.forChild(myAccountRoutes)],
  exports: [RouterModule, ...MyAccountComponents],
})
export class MyAccountModule {}

@NgModule({
  declarations: TheirProfileComponents,
  imports: [SharedModule, RouterModule.forChild(profileRoutes)],
  exports: [RouterModule, ...TheirProfileComponents],
})
export class ProfileModule {}
