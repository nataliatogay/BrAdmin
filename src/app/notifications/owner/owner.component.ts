import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OwnerRequestInfo } from 'src/app/core/models/owner-request-info';
import { NewOwnerRequest } from 'src/app/core/models/new-owner-request';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  ownerForm: FormGroup;

  constructor(
    private fb: FormBuilder,

    public dialogRef: MatDialogRef<OwnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OwnerRequestInfo
  ) { }

  ngOnInit() {
    this.ownerForm = this.fb.group({
      ownerName: [this.data.ownerName, Validators.required],
      organizationName: [this.data.organizationName],
      email: [this.data.email, Validators.required],
      ownerPhoneNumber: [this.data.ownerPhoneNumber, Validators.required],
      comments: [this.data.comments]
    });
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      const newOwnerRequest = new NewOwnerRequest(
        this.ownerForm.value.ownerName,
        this.ownerForm.value.email,
        this.ownerForm.value.ownerPhoneNumber,
        this.ownerForm.value.organizationName,
        this.data.id
      );
      this.dialogRef.close({ event: 'add', data: newOwnerRequest });
    }

  }


  declineRequest() {
    this.dialogRef.close({ event: 'decline', data: this.data.id });
  }

  cancelWindow() {
    this.dialogRef.close({ event: 'cancel' });
  }


}
