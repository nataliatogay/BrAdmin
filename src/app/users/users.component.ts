import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { UserService } from '../core/services/user.service';
import { UserInfoShort } from '../core/models/user-info-short';
import { StatusCode, ServerResponseGeneric } from '../core/models/server-response';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: UserInfoShort[] = [];

  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'email', 'number', 'registrationDate', 'blocked', 'deleted'];

  usersDataSource = new MatTableDataSource;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator: MatPaginator) {
    this.usersDataSource.paginator = paginator;
  }

  view = true;
  oldId = 'gridId';

  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      (result: ServerResponseGeneric<UserInfoShort[]>) => {
        if (result.statusCode === StatusCode.Ok) {
          this.users = result.data;
          this.usersDataSource.data = this.users;
        } else {

          alert(result.statusCode);
        }
      }
    )
  }
  

  viewChange(id, vBool) {
    document.getElementById(this.oldId).classList.toggle('choosenView');

    document.getElementById(id).classList.toggle('choosenView');

    this.oldId = id;
    this.view = vBool;
  }

}
