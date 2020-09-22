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
import { NotificationType } from '../core/models/notification-type';
import { NotificationComponent } from './notification/notification.component';
import { LoadingService } from '../core/services/loading.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {

  notifications: NotificationInfo[] = [];



  dialogRef: MatDialogRef<ConfirmationDialogComponent>;

  constructor(
    private notificationService: NotificationService,
    private clientService: ClientService,
    private ownerService: OwnerService,
    public dialog: MatDialog,
    public router: Router,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.setIsLoading(true);
    this.notificationService.getNotifications()
      .pipe(first())
      .subscribe(
        (result: ServerResponseGeneric<NotificationInfo[]>) => {
          if (result.statusCode === StatusCode.Ok) {
            this.notifications = result.data;
          }
          console.log(this.notifications);

          this.loadingService.setIsLoading(false);
        },
        (error) => {
          console.log(error);
          this.loadingService.setIsLoading(false);
        }
      );
  }




  openNotification(notification: NotificationInfo) {
    console.log(notification);
    const notifDialog = this.dialog.open(NotificationComponent, { data: notification, disableClose: true });
    notifDialog.afterClosed().subscribe(
      (dialogResult) => {
        console.log(dialogResult);
        if (dialogResult.data) {
          const index = this.notifications.findIndex(item => item.id === notification.id);
          if (index !== -1) {
            this.notifications.splice(index, 1);
          }
          this.notificationService.handleNotification(notification.id).subscribe(
            (result) => { }
          );
          // сделать метод для прочитанных уведомлений
        }
        if (dialogResult.event === 'link') {
          if (notification.notificationTypeId === NotificationType.RequestOwner) {
            let requestInfo: OwnerRequestInfo;
            this.notificationService.getRequest(notification.reference)
              .pipe(first())
              .subscribe(
                (response: ServerResponseGeneric<OwnerRequestInfo>) => {
                  if (response.statusCode === StatusCode.Ok) {
                    requestInfo = response.data;
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
                              alert('New client was confirmed');
                              if (result.statusCode === StatusCode.Ok) {
                                // alert('Success');
                                // window.location.reload();
                              } else {
                                // alert(result.statusCode);
                              }
                            });
                        }
                      }

                      // this.router.navigate(['/notifications']);
                    });

                  }
                },
                error => {

                }
              );
            console.log('yes');
          } else if (notification.notificationTypeId === NotificationType.RequestClient) {
            this.clientService.getRegisteredClientInfo(notification.reference)
              .pipe(first())
              .subscribe(
                (response: ServerResponseGeneric<ClientInfoShort>) => {
                  console.log(response.statusCode);
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
                          this.clientService.confirmClient(notification.reference)
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
              );
          }
        }
        console.log(dialogResult);
      }
    );


  }
}
