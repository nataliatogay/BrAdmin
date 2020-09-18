import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationInfo } from 'src/app/core/models/notification-info';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  // styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationInfo
  ) { }

  ngOnInit() {

  }

  buttonClick() {
    console.log(this.data);
  }

}
