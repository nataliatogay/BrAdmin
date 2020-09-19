import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { MaterialAppModule } from '../ngmaterial.module';
import { ClientComponent } from './client/client.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewClientComponent } from './new-client/new-client.component';
import { AgmCoreModule } from '@agm/core';
import { AppModule } from '../app.module';
import { LibraryItemComponent } from './library-item/library-item.component';
import { NewAdminComponent } from '../Utils/new-admin/new-admin.component';
import { NewParameterComponent } from '../Utils/new-parameter/new-parameter.component';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientComponent,
    LibrariesComponent,
    LibraryItemComponent,
    NewClientComponent,
    NewAdminComponent,
    NewParameterComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MaterialAppModule,
    ReactiveFormsModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA99t8a-S-OJffxtVvUfkLr3xKj8e_cWUo'
    })
  ],
  entryComponents: [
    LibraryItemComponent,
    NewClientComponent,
    NewAdminComponent,
    NewParameterComponent
  ]
})
export class ClientsModule { }
