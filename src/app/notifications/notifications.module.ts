import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { MaterialAppModule } from '../ngmaterial.module';
import { OwnerComponent } from './owner/owner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ClientFormComponent } from './client-form/client-form.component';

@NgModule({
  declarations: [NotificationsComponent, OwnerComponent, ClientFormComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    MaterialAppModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  entryComponents: [OwnerComponent, ClientFormComponent],
})
export class NotificationsModule {}
