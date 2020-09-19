import { AccountService } from 'src/app/core/services/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusCode } from 'src/app/core/models/server-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: ['']
  });

  isPassShow = false;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.accountService.isAuth()) {
      this.router.navigate(['']);
      // this.router.navigate(['applicationUsers/clients']);
    }
  }

  login() {
    if (this.loginForm.valid) {

      this.accountService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.remember).subscribe(
        (result) => {
          if (result.statusCode === StatusCode.Ok) {
            this.router.navigate(['clients']);
            window.location.reload();
          } else {
            alert(result.statusCode);
          }
        },
        (err) => {
          alert('error!');
          console.log(err);
        });
    }
    // this.router.navigate(['profile']);
  }

  forgotPassword() {
    this.router.navigate(['']);
  }

  public forgotWin(en) {
    if (en) {
      document.getElementById('loginId').style.display = 'none';
      document.getElementById('forgotId').style.display = 'grid';
    } else {
      document.getElementById('loginId').style.display = 'grid';
      document.getElementById('forgotId').style.display = 'none';
    }
  }

  togglePass(isShow, elem: HTMLInputElement) {
    if (isShow) {
      this.isPassShow = true;

      elem.type = 'text';
    } else {
      this.isPassShow = false;

      elem.type = 'password';
    }
  }
}
