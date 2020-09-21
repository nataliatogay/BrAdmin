import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponseGeneric, ServerResponse } from '../models/server-response';
import { NotificationInfo } from '../models/notification-info';
import { OwnerRequestInfo } from '../models/owner-request-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationUrl = `${environment.serverApi}notification`;

  private requestUrl = `${environment.serverApi}request`;

  constructor(public http: HttpClient) { }



  getNotifications(): Observable<ServerResponseGeneric<NotificationInfo[]>> {
    return this.http.get<ServerResponseGeneric<NotificationInfo[]>>(`${this.notificationUrl}`);
  }

  getRequest(id: number): Observable<ServerResponseGeneric<OwnerRequestInfo>> {
    return this.http.get<ServerResponseGeneric<OwnerRequestInfo>>(`${this.requestUrl}/${id}`);
  }

  declineRequest(resuestId: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.requestUrl}/decline`, resuestId);
  }

  handleNotification(notificationId: string): Observable<ServerResponse> {
    console.log(`${this.notificationUrl}/Handle/${notificationId}`);
    return this.http.get<ServerResponse>(`${this.notificationUrl}/Handle/${notificationId}`);
   
  }
}
