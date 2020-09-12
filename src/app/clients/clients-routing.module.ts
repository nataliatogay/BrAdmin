import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { ClientComponent } from './client/client.component';

const routes: Routes = [
  {
    path: 'libraries', component: LibrariesComponent
  },
  {
    path: '', component: ClientsComponent
  },
  { 
    path: ':id', component: ClientComponent 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
