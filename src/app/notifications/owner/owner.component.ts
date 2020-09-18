import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OwnerRequestInfo } from 'src/app/core/models/owner-request-info';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { StatusCode, ServerResponseGeneric } from 'src/app/core/models/server-response';
import { OrganizationInfo } from 'src/app/core/models/organization-info';
import { NewOwnerRequest } from 'src/app/core/models/new-owner-request';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  organizations: OrganizationInfo[] = [];

  ownerForm: FormGroup;

  constructor(
    private fb: FormBuilder,

    private organizationService: OrganizationService,
    public dialogRef: MatDialogRef<OwnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OwnerRequestInfo
  ) { }

  ngOnInit() {
    this.ownerForm = this.fb.group({
      ownerName: [this.data.ownerName, Validators.required],
      organizationId: ['', Validators.required],
      organizationName: [this.data.organizationName],
      email: [this.data.email, Validators.required],
      ownerPhoneNumber: [this.data.ownerPhoneNumber, Validators.required],
      comments: [this.data.comments]
    });
    this.organizationService.getOrganizations().subscribe(
      (result: ServerResponseGeneric<OrganizationInfo[]>) => {
        if (result.statusCode === StatusCode.Ok) {
          this.organizations = result.data;
        }

      }
    );
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      const newOwnerRequest = new NewOwnerRequest(
        this.ownerForm.value.ownerName,
        this.ownerForm.value.email,
        this.ownerForm.value.ownerPhoneNumber,
        this.ownerForm.value.organizationId,
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


  addOrganization() {
    if (this.ownerForm.value.organizationName != null && this.ownerForm.value.organizationName.trim() !== '') {

      this.organizationService.addOrganization(this.ownerForm.value.organizationName).subscribe(
        (result: ServerResponseGeneric<OrganizationInfo>) => {

          if (result.statusCode === StatusCode.Ok) {
            this.organizations.push(result.data);
          }
        }
      );
    }

  }

}
