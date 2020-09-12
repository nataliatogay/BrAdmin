import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { StatusCode, ServerResponse } from 'src/app/core/models/server-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: []
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {

      if (this.changePasswordForm.value.currentPassword != this.changePasswordForm.value.newPassword) {



        if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.repeatPassword) {

          this.accountService.changePassword(this.changePasswordForm.value.newPassword).subscribe(
            (result: ServerResponse) => {
              if (result.statusCode === StatusCode.Ok) {
                alert('Your password has been successfully changed');
                this.router.navigate(['']);
              } else {
                alert(result.statusCode);
              }
            }
          )
        } else {
          alert('New password is not equal to repeated one')
        }
      } else {
        alert('New password is equal to current one')
      }

    }
  }

}
