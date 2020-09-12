import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { Router } from '@angular/router';
import { StatusCode, ServerResponse } from 'src/app/core/models/server-response';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styles: []
})
export class ChangeEmailComponent implements OnInit {

  changeEmailForm: FormGroup;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.changeEmailForm = this.fb.group({
      newEmail: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.changeEmailForm.valid) {

      this.accountService.changeEmail(this.changeEmailForm.value.newEmail).subscribe(
        (result: ServerResponse) => {
          if (result.statusCode === StatusCode.Ok) {
            alert('Confirmation link has been sent');
            this.router.navigate(['']);
          } else {
            alert(result.statusCode);
          }
        }
      )
    }
  }

}
