import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { event } from 'jquery';
import { NotificationInfo } from 'src/app/core/models/notification-info';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  isDone = false;

  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationInfo
  ) { }

  ngOnInit() {
    // console.log(this.data.description);
  }

  buttonClick() {
    console.log(this.data);
  }

  closeWindow() {
    console.log(this.isDone);
    this.dialogRef.close({ event: 'close', data: this.isDone });
  }

  openLink() {
    this.dialogRef.close({ event: 'link', data: this.isDone });
  }

}
