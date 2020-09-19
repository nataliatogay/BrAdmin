import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatCardModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    TextMaskModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatCardModule,
    NgxMaterialTimepickerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    TextMaskModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})

export class MaterialAppModule { }
