import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomErrorStateMatcher } from '../CustomErrorStateMatcher';
import { isUndefined } from 'util';
import { ClientAdminInfo } from 'src/app/core/models/client-admin-info';
import { NewClientAdmin } from 'src/app/core/models/new-client-admin';


@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.less'],
})
export class NewAdminComponent implements OnInit {
  numberAdminFocus = false;

  numberMask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  adminForm: FormGroup;

  matcher = new CustomErrorStateMatcher();

  constructor(
    public dialogNewAdmin: MatDialogRef<NewAdminComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.adminForm = this.fb.group({
      name: [this.data == null ? '' : this.data.name, Validators.required],
      phoneNumber: [this.data == null ? '' : this.data.phoneNumber, Validators.required],
      email: [this.data == null ? '' : this.data.email, [Validators.required, Validators.email]],
    });
    if (this.data != null) {
      console.log(isUndefined(this.data.id));
    }
    if (this.data != null && !isUndefined(this.data.id)) {
      this.adminForm.addControl('isActive', new FormControl(this.data.isActive, Validators.required));
    }
  }

  replaceAll(sourceString: string, searchCharArray: string[], replaceChar: string) {
    searchCharArray.forEach(element => {
      sourceString = sourceString.split(element).join(replaceChar);
    });
    return sourceString;
  }

  onSubmit() {
    if (this.adminForm.valid) {

      const phone = this.replaceAll(this.adminForm.value.phoneNumber, ['_', ' '], '');

      console.log(phone);
      let admin;
      if (this.data != null && !isUndefined(this.data.id)) {
        admin = new ClientAdminInfo(
          this.data.id,
          this.adminForm.value.email,
          this.adminForm.value.name,
          phone,
          this.adminForm.value.isActive
        );
      } else {
        admin = new NewClientAdmin(
          this.adminForm.value.email,
          this.adminForm.value.name,
          phone
        );
      }

      this.dialogNewAdmin.close(admin);
    }
  }
}
