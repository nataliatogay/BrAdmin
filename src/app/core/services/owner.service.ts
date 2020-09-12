import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewOwnerRequest } from '../models/new-owner-request';
import { ServerResponse } from '../models/server-response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  // private url = 'https://rbwebapp.azurewebsites.net/api/owner';
  // private url = 'http://localhost:5000/api/owner';

  private url = `${environment.serverApi}owner`;

  constructor(public http: HttpClient){}


  addOwner(owner: NewOwnerRequest): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}`, owner);
  }
}
