import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponseGeneric, ServerResponse } from '../models/server-response';
import { UserInfoShort } from '../models/user-info-short';
import { UserInfoFull } from '../models/user-info-full';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {


  // private url = 'https://rbwebapp.azurewebsites.net/api/user';
  // private url = 'http://localhost:5000/api/user';

  private url = `${environment.serverApi}user`;

  constructor(public http: HttpClient) { }

  getUsers(): Observable<ServerResponseGeneric<UserInfoShort[]>> {
    return this.http.get<ServerResponseGeneric<UserInfoShort[]>>(`${this.url}/ShortForAdmin`);
  }

  getUser(userId: number): Observable<ServerResponseGeneric<UserInfoFull>> {
    return this.http.get<ServerResponseGeneric<UserInfoFull>>(`${this.url}/ForAdmin/${userId}`);
  }

  blockUser(id: number): Observable<ServerResponse> {
    console.log(id);
    return this.http.put<ServerResponse>(`${this.url}/Block`, id);
  }

  unblockUser(id: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/Unblock`, id);
  }


}
