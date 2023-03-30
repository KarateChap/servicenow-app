import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnhancementComponent } from './enhancement/enhancement.component';
import { IncidentComponent } from './incident/incident.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'incidents', pathMatch: 'full' },
  { path: 'incidents', component: IncidentComponent },
  { path: 'enhancements', component: EnhancementComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
