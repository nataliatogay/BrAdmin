import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerResponseGeneric } from '../models/server-response';
import { OrganizationInfo } from '../models/organization-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class OrganizationService {

  // private url = 'https://rbwebapp.azurewebsites.net/api/organization';
  // private url = 'http://localhost:5000/api/organization';

  private url = `${environment.serverApi}organization`;



  constructor(public http: HttpClient){}
  


  getOrganizations():Observable<ServerResponseGeneric<OrganizationInfo[]>> {
    console.log('org service getOrganizations')
    return this.http.get<ServerResponseGeneric<OrganizationInfo[]>>(`${this.url}`);
  }


  addOrganization(title:string):Observable<ServerResponseGeneric<OrganizationInfo>>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ServerResponseGeneric<OrganizationInfo>>(`${this.url}`, JSON.stringify(title), { headers });
  }
}
