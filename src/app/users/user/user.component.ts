import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoFull } from 'src/app/core/models/user-info-full';
import { ConfirmationDialogComponent } from 'src/app/Utils/confirmation-dialog/confirmation-dialog.component';
import { StatusCode, ServerResponse } from 'src/app/core/models/server-response';
import { ShowPictureComponent } from 'src/app/Utils/show-picture/show-picture.component';
import { ConfirmationType } from 'src/app/core/models/confirmation-type';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  user: UserInfoFull;

  constructor(
    public userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ShowPictureComponent>,
    private dialogConfirmRef: MatDialogRef<ConfirmationDialogComponent>,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.setIsLoading(true);
    this.route.params.forEach((params) => {
      const userId = +params['id'];

      this.userService.getUser(userId).subscribe(
        (result) => {
          if (result.statusCode === StatusCode.Ok) {
            this.user = result.data;
            this.userForm = this.fb.group({
              firstName: [this.user.firstName],
              lastName: [this.user.lastName],
              email: [this.user.email],
              phoneNumber: [this.user.phoneNumber],
              gender: [this.user.gender],
              birthDate: [this.user.birthDate],
              registrationDate: [this.user.registrationDate]
            });

            this.loadingService.setIsLoading(false);
          } else {
            alert(result.statusCode);
            this.router.navigate(['users']);
          }
        }
      );
    });
  }



  blockUser() {
    this.dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: `User \'${this.user.firstName} ${this.user.lastName}\' will be blocked`,
        title: 'Confirmation'
      }
    });

    this.dialogConfirmRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.userService.blockUser(this.user.id).subscribe(
          (result: ServerResponse) => {
            if (result.statusCode === StatusCode.Ok) {
              this.user.blocked = new Date();
              alert('User has been blocked');

            } else {
              alert(result.statusCode);
            }
          }
        );
      }
    });
  }



  unblockUser() {
    this.dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: `User \'${this.user.firstName} ${this.user.lastName}\' will be unblocked`,
        title: 'Confirmation'
      }
    });

    this.dialogConfirmRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.userService.unblockUser(this.user.id).subscribe(
          (result: ServerResponse) => {
            if (result.statusCode === StatusCode.Ok) {
              this.user.blocked = null;
              alert('User has been unblocked');

            } else {
              alert(result.statusCode);
            }
          }
        );
      }
    });
  }

  showPic() {
    this.dialogRef = this.dialog.open(ShowPictureComponent, {
      data: {
        mainImagePath: this.user.imagePath,
        isMainImage: true,
        imagePathsArray: '',
        clientId: null
      }
    });

    this.dialogRef.afterClosed().subscribe(dialogResult => {


      this.dialogRef = null;
    });
  }
}
