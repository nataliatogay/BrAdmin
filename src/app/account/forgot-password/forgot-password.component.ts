import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerResponse, StatusCode } from 'src/app/core/models/server-response';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', Validators.required],
    password: ['', [Validators.required]],
  });

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    if (this.accountService.isAuth()) {
      this.router.navigate(['']);
    
    }
  }


  forgotPassword() {
    this.accountService.forgotPassword(this.forgotForm.value.email).subscribe(
      (result: ServerResponse) => {
        if (result.statusCode == StatusCode.Ok) {
          document.getElementById('codeDiv').style.display = 'grid';
          document.getElementById('emailButton').style.display = 'none';
          document.getElementById('sendButton').style.display = 'block';
        } else {
          alert(result.statusCode.toString());
        }
      }
    )
  }

  resetPassword() {
      this.accountService.resetPassword(this.forgotForm.value.email, this.forgotForm.value.code, this.forgotForm.value.password).subscribe(
        (result: ServerResponse) => {
          if (result.statusCode == StatusCode.Ok) {
            alert('password has been changed');
            this.router.navigate(['/account/login']);
          }
        }
      )
    }
  }
