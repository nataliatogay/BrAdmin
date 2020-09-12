import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsComponent } from './notifications.component';
// import { OwnerComponent } from './owner/owner.component';

const routes: Routes = [
  { path: '', component: NotificationsComponent, children: [
    // { path: ':id', component: OwnerComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
