import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerResponseGeneric, ServerResponse } from '../models/server-response';
import { ClientParameterInfo } from '../models/client-parameter-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ParameterService {

  // private url = 'https://rbwebapp.azurewebsites.net/api/parameter';
  // private url = 'http://localhost:5000/api/parameter';

  private url = `${environment.serverApi}parameter`;


  constructor(public http: HttpClient) { }



  addParameter(title: string, method: string): Observable<ServerResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ServerResponse>(`${this.url}/${method}`, JSON.stringify(title), { headers });
  }

  updateParameter(parameter: ClientParameterInfo, method: string): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/${method}`, parameter);
  } 

  deleteParameter(id: number, method: string): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${this.url}/${method}/${id}`);
  }


  getMealTypes(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/mealType`);
  }

  getCuisines(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/cuisine`);
  }
  
  getClientTypes(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/clientType`);
  }  

  getDishes(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/dish`);
  }

  getGoodFors(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/goodFor`);
  }  

  getSpecialDiets(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/specialDiet`);
  }
  
  getFeatures(): Observable<ServerResponseGeneric<ClientParameterInfo[]>> {
    return this.http.get<ServerResponseGeneric<ClientParameterInfo[]>>(`${this.url}/feature`);
  }
  
}
