import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponse, ServerResponseGeneric } from '../models/server-response';
import { HttpClient } from '@angular/common/http';
import { NewClientRequest } from '../models/new-client-request';
import { ClientInfoFull } from '../models/client-info-full';
import { ClientInfoShort } from '../models/client-info-short';
import { UpdateClientRequest } from '../models/update-client-request';
import { UploadMainImageRequest } from '../models/upload-main-image-request';
import { UploadImagesRequest } from '../models/upload-images-request';
import { ClientImageInfo } from '../models/client-image-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ClientService {


  // private url = 'https://rbwebapp.azurewebsites.net/api/client';
  // private url = 'http://localhost:5000/api/client';
  private url = `${environment.serverApi}client`;



  constructor(public http: HttpClient) { }

  addClient(client: NewClientRequest): Observable<ServerResponse> {
    return this.http.post<ServerResponse>(`${this.url}/NewByAdmin`, client);
  }

  getClients(): Observable<ServerResponseGeneric<ClientInfoShort[]>> {
    return this.http.get<ServerResponseGeneric<ClientInfoShort[]>>(`${this.url}/ShortForAdmin`);
  }


  getClientFullInfo(clientId: number): Observable<ServerResponseGeneric<ClientInfoFull>> {
    return this.http.get<ServerResponseGeneric<ClientInfoFull>>(`${this.url}/FullInfoForAdmin/${clientId}`);
  }


  getRegisteredClientInfo(clientId: number): Observable<ServerResponseGeneric<ClientInfoShort>> {
    return this.http.get<ServerResponseGeneric<ClientInfoShort>>(`${this.url}/GetRegisteredClient/${clientId}`);
  }



  updateClient(client: UpdateClientRequest): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/UpdateByAdmin`, client);
  }

  confirmClient(id: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/ConfirmClientRegistration`, id);
  }

  blockClient(id: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/Block`, id);
  }

  unblockClient(id: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/Unblock`, id);
  }

  uploadMainImage(uploadRequest: UploadMainImageRequest): Observable<ServerResponseGeneric<string>> {

    console.log('client service');
    return this.http.post<ServerResponseGeneric<string>>(`${this.url}/UploadMainImageByAdmin`, uploadRequest);
  }

  setAsMainImage(imageId: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.url}/SetAsMainImageByAdmin`, imageId);
  }

  uploadImages(uploadRequest: UploadImagesRequest): Observable<ServerResponseGeneric<ClientImageInfo[]>> {

    return this.http.post<ServerResponseGeneric<ClientImageInfo[]>>(`${this.url}/UploadImagesByAdmin`, uploadRequest);

  }

  deleteImage(imageId: number): Observable<ServerResponse> {
    return this.http.delete<ServerResponse>(`${this.url}/DeleteImageByAdmin/${imageId}`);
  }

}
