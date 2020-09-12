import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAppModule } from './ngmaterial.module';
import { ConfirmationDialogComponent } from './Utils/confirmation-dialog/confirmation-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './Utils/auth-interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowPictureComponent } from './Utils/show-picture/show-picture.component';
import { LoadingComponent } from './Utils/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    ShowPictureComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialAppModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmationDialogComponent,
    ShowPictureComponent,
  ],
})
export class AppModule {}
