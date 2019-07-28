import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './component/home/home.component';
import { ProjectsComponent } from './component/projects/pages/home/home.component';
import { AuthenticationLoginComponent } from './component/authentication/pages/login/login.component';
import { RegisterComponent } from './component/authentication/pages/register/register.component';
import { SendAudioComponent } from './component/send-audio/send-audio.component';
import { DataRequestComponent } from './component/data-request/data-request.component';
import { ListenComponent } from './component/listen/pages/home/home.component';
import { ProfileComponent } from './component/profile/pages/home/home.component';
import { AudioAnalysisComponent } from './component/audio-analysis/audio-analysis.component';
import { WebStatisticsComponent } from './component/web-statistics/web-statistics.component';
import { LibraryComponent } from './component/library/pages/home/home.component';
import { aboutRoutes } from './component/about/about.routes';
import { researchRoutes } from './component/research/research.routes';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'about', children: aboutRoutes },
  { path: 'audio_analysis', component: AudioAnalysisComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'listen', component: ListenComponent },
  { path: 'login', component: AuthenticationLoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'data_request', component: DataRequestComponent },
  { path: 'statistics', component: WebStatisticsComponent },
  { path: 'send_audio', component: SendAudioComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'research', children: researchRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
