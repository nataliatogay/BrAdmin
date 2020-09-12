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

  getNotificationsCount(): Observable<ServerResponseGeneric<number>> {
    return this.http.get<ServerResponseGeneric<number>>(`${this.notificationUrl}/AdminNotificationsCount`);
  }

  getNotifications(skip: number, take: number): Observable<ServerResponseGeneric<NotificationInfo[]>> {
    return this.http.get<ServerResponseGeneric<NotificationInfo[]>>(`${this.notificationUrl}/AdminNotifications`, { params: { skip: skip.toString(), take: take.toString() } });
  }

  getUndoneNotificationsCount(): Observable<ServerResponseGeneric<number>> {
    return this.http.get<ServerResponseGeneric<number>>(`${this.notificationUrl}/UndoneAdminNotificationsCount`);
  }

  getRequest(id: number): Observable<ServerResponseGeneric<OwnerRequestInfo>> {
    return this.http.get<ServerResponseGeneric<OwnerRequestInfo>>(`${this.requestUrl}/${id}`);
  }

  declineRequest(resuestId: number): Observable<ServerResponse> {
    return this.http.put<ServerResponse>(`${this.requestUrl}/decline`, resuestId);
  }
}
