import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientParameterInfo } from 'src/app/core/models/client-parameter-info';

export interface LibraryDialogData {
  selectedArrayIndex: number;
  item: ClientParameterInfo;
}

@Component({
  selector: 'app-edit-new-libraries',
  templateUrl: './library-item.component.html',
  styleUrls: ['./library-item.component.css']
})
export class LibraryItemComponent implements OnInit {

  libraryForm: FormGroup;

  titles = ['Client Type', 'Cuisine', 'Dish', 'Good For', 'Special Diet', 'Feature']

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LibraryItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LibraryDialogData
  ) { }

  ngOnInit() {

    this.libraryForm = this.fb.group({
      title: [this.data.item == null ? '' : this.data.item.title, Validators.required]
    });

  }

  onSubmit() {
    if (this.libraryForm.valid) {
      this.dialogRef.close(this.libraryForm.value.title);
    }
  }
}
