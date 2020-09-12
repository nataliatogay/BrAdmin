import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { tap } from 'rxjs/operators';
import { ServerResponse, ServerResponseGeneric, StatusCode } from '../models/server-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // private url = 'https://rbwebapp.azurewebsites.net/api/adminAccount';
  // private url = 'http://localhost:5000/api/adminAccount';

  private url = `${environment.serverApi}adminAccount`;
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient) { }


  isAuth() {
    return localStorage.getItem('accessToken') != null || sessionStorage.getItem('accessToken') != null;
  }


  login(email: string, password: string, remember: boolean): Observable<ServerResponseGeneric<LoginResponse>> {
    //const uuid = require('uuid/v1');
    return this.http.post<ServerResponseGeneric<LoginResponse>>(`${this.url}/Login`, { email: email, password: password, notificationTag: "uuid()" }).pipe(tap((result) => {
      if (result.statusCode == StatusCode.Ok) {
        if (remember) {
          localStorage.setItem('accessToken', result.data.accessToken);
          localStorage.setItem('refreshToken', result.data.refreshToken);
          localStorage.setItem('notificationTag', "uuid()")
        }
        else {
          sessionStorage.setItem('accessToken', result.data.accessToken);
          sessionStorage.setItem('refreshToken', result.data.refreshToken);
          sessionStorage.setItem('notificationTag', "uuid()");
        }
      }
    }));
  }

// переделать с очищением local(session)Storage
  logOut(): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/LogOut`, JSON.stringify("uuid()"), { headers: this.headers });
  }

  forgotPassword(email: string): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/ForgotPassword`, JSON.stringify(email), { headers: this.headers });
  }


  resetPassword(email: string, code: string, password: string): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/ResetPassword`, { email: email, code: code, password: password });
  }

  changePassword(newPassword: string): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/ChangePassword`, JSON.stringify(newPassword), { headers: this.headers });
  }

  changeEmail(newEmail: string): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/ChangeEmail`, JSON.stringify(newEmail), { headers: this.headers });
  }

}
