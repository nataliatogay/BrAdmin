import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../Utils/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';
import { NotificationInfo } from '../core/models/notification-info';
import {
  ServerResponseGeneric,
  StatusCode,
  ServerResponse,
} from '../core/models/server-response';
import { OwnerService } from '../core/services/owner.service';
import { OwnerComponent } from './owner/owner.component';
import { OwnerRequestInfo } from '../core/models/owner-request-info';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientService } from '../core/services/client.service';
import { first } from 'rxjs/operators';
import { ClientInfoShort } from '../core/models/client-info-short';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notificationCount: number;

  notifications: NotificationInfo[] = [];

  currentPage = 1;
  byCount = 50;
  pagesView: string;
  lastPage: number;

  currentDate: string;

  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private notificationService: NotificationService,
    private clientService: ClientService,
    private ownerService: OwnerService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit() {
    forkJoin(
      this.notificationService.getNotificationsCount(),
      this.notificationService.getNotifications(0, this.byCount)
    ).subscribe(
      (result: any) => {
        this.notificationCount = result[0].data;
        this.notifications = result[1].data;

        console.log(this.notifications);

        this.lastPage = Math.ceil(this.notificationCount / this.byCount);
        this.pagesView = this.getPagesViewLabel();
        this.currentDate = new Date().toLocaleDateString();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPagesViewLabel() {
    if (this.lastPage === 0) {
      return '0-0';
    }

    const fromCount = (this.currentPage - 1) * this.byCount + 1;
    let toCount = this.currentPage * this.byCount;

    if (this.currentPage === this.lastPage) {
      toCount = this.notificationCount;
    }
    return fromCount + '-' + toCount;
  }

  pageChange(dir) {
    if (dir) {
      this.currentPage++;
    } else {
      this.currentPage--;
    }

    this.notificationService
      .getNotifications((this.currentPage - 1) * this.byCount, this.byCount)
      .subscribe(
        (result: ServerResponseGeneric<NotificationInfo[]>) => {
          if (result.statusCode === StatusCode.Ok) {
            this.notifications = result.data;
          } else {
            alert(result.statusCode);
          }
        },
        (error) => { }
      );
    // this.notifications = this.notifServ.getShortListNotif(this.currentPage, this.byCount);

    this.pagesView = this.getPagesViewLabel();
  }

  openClientForm(item) {

  }

  openNotification(notification: NotificationInfo) {
    if (notification.notificationType.toLocaleUpperCase() === 'REQUEST') {
      let requestInfo: OwnerRequestInfo;
      this.notificationService
        .getRequest(notification.requestId)
        .subscribe((result: ServerResponseGeneric<OwnerRequestInfo>) => {
          if (result.statusCode === StatusCode.Ok) {
            requestInfo = result.data;
            requestInfo.done = notification.done;
            // requestInfo.done = false;
            setTimeout(() => {
              const dialogRef = this.dialog.open(OwnerComponent, {
                data: requestInfo,
                disableClose: true,
              });

              dialogRef.afterClosed().subscribe((dialogResult) => {
                if (dialogResult.event === 'decline') {
                  this.notificationService
                    .declineRequest(dialogResult.data)
                    .subscribe((result: ServerResponse) => {
                      if (result.statusCode === StatusCode.Ok) {
                        alert('Success');
                        window.location.reload();
                      } else {
                        alert(result.statusCode);
                      }
                    });
                } else if (dialogResult.event === 'add') {
                  if (dialogResult.data != null) {
                    this.ownerService
                      .addOwner(dialogResult.data)
                      .subscribe((result: ServerResponse) => {
                        if (result.statusCode === StatusCode.Ok) {
                          alert('Success');
                          window.location.reload();
                        } else {
                          alert(result.statusCode);
                        }
                      });
                  }
                }

                // this.router.navigate(['/notifications']);
              });
            });
          }
        });
    } else if (
      notification.notificationType.toLocaleUpperCase() === 'REGISTRATION'
    ) {
      console.log(notification);
      this.clientService.getRegisteredClientInfo(notification.clientId)
        .pipe(first())
        .subscribe(
          (response: ServerResponseGeneric<ClientInfoShort>) => {
            if (response.statusCode === StatusCode.Ok) {
              console.log(response.data);
              const dialogRef = this.dialog.open(ClientFormComponent, {
                data: response.data,
                disableClose: true,
              });

              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                if (result != null) {
                  // confirm client
                  if (result) {
                    this.clientService.confirmClient(notification.clientId)
                      .pipe(first())
                      .subscribe(
                        (responseConfirm: ServerResponse) => {
                          if (responseConfirm.statusCode === StatusCode.Ok) {
                            alert('Client was confirmed');
                          } else {
                            alert('Some error occured');
                            console.log(responseConfirm.statusCode);
                          }
                        },
                        (error) => {
                          console.log('Some error occured');
                          console.log(error);
                        }
                      );
                  }
                }
              });
            }
          }
        )



    }
  }
}
