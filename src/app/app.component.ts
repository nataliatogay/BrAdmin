import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AccountService } from './core/services/account.service';
import { Router } from '@angular/router';
import { ServerResponse, StatusCode, ServerResponseGeneric } from './core/models/server-response';
import { NotificationService } from './core/services/notification.service';
import { LoadingService } from './core/services/loading.service';
import { isNull } from 'util';
import { NotificationInfo } from './core/models/notification-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(
    private accountService: AccountService,
    private notificationService: NotificationService,
    private router: Router,
    private location: Location,
    public loadingService: LoadingService
  ) { }

  title = 'BrAdminWithRoute';
  isAuth = true;

  oldId = '';

  undoneNotificationCount = 0;

  ngOnInit() {
    this.isAuth = this.accountService.isAuth();

    if (!this.isAuth) {
      this.router.navigate(['/account/login']);
    } else {

      this.notificationService.getNotifications().subscribe(
        (result: ServerResponseGeneric<NotificationInfo[]>) => {
          if (result.statusCode === StatusCode.Ok) {
            this.undoneNotificationCount = result.data.length;
          }
        },
        (error) => {
          console.log(error);
          this.undoneNotificationCount = 0;
        }
      );

    }
  }

  ngAfterViewInit() {
    if (this.isAuth) {

      const route = this.location.path();

      console.log(route);

      if (route.includes('clients/libraries')) {
        this.oldId = 'librariesId';
      } else if (route.includes('users')) {
        this.oldId = 'usersId';
      } else if (route.includes('statistics')) {
        this.oldId = 'statisticsId';
      } else if (route.includes('notifications')) {
        this.oldId = 'notificationsId';
      } else if (route.includes('clients') || !route.localeCompare('')) {
        this.oldId = 'clientsId';
      } else {
        this.oldId = 'clientsId'
      }

      let elem = document.getElementById(this.oldId);

      if (!isNull(elem)) {
        elem.classList.add('checkedLine');
      }
    }

  }

  logOut() {
    this.accountService.logOut().subscribe(
      (result: ServerResponse) => {
        if (result.statusCode === StatusCode.Ok) {
          console.log('Ok');
        }
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    )
  }

  routeChange(id) {
    if (this.oldId.localeCompare('')) {
      document.getElementById(this.oldId).classList.remove('checkedLine');
    }

    document.getElementById(id).classList.add('checkedLine');

    this.oldId = id;
  }
}
