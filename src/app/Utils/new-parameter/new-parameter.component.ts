import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-parameter',
  templateUrl: './new-parameter.component.html',
  styleUrls: ['./new-parameter.component.less']
})
export class NewParameterComponent implements OnInit {

  parameterForm: FormGroup;

  titles = ['Client Type', 'Cuisine', 'Dish', 'Good For', 'Special Diet', 'Feature']

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewParameterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  ngOnInit() {
    this.parameterForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.parameterForm.valid) {
      this.dialogRef.close(this.parameterForm.value.title);
    }
  }

}
