import { Injectable } from '@angular/core';
import { StatusCode } from '../models/server-response';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/Utils/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationType } from '../models/confirmation-type';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private router: Router,
    private dialog: MatDialog) { }

  handleServerResponse(statusCode: StatusCode) {
    let message = '';
    switch (statusCode) {
      case StatusCode.RoleNotFound:
        message = 'RoleNotFound';
        break;

      case StatusCode.SendingMailError:
        message = 'SendingMailError';
        break;

      case StatusCode.SendingMessageError:
        message = 'SendingMessageError';
        break;

      case StatusCode.SendingNotificationError:
        message = 'SendingNotificationError';
        break;

      case StatusCode.TokenError:
        message = 'TokenError';
        break;

      case StatusCode.UserBlocked:
        message = 'Account has been blocked';
        break;

      case StatusCode.UserDeleted:
        message = 'Account has been deleted';
        break;

      case StatusCode.UserNotFound:
        message = 'UserNotFound';
        break;

      case StatusCode.UserUnblocked:
        message = 'UserUnblocked';
        break;

      case StatusCode.BlobError:
        message = 'Connection error';
        break;

      case StatusCode.CodeHasAlreadyBeenSent:
        message = 'Code has already been sent';
        break;

      case StatusCode.DbConnectionError:
        message = 'Connection error';
        break;

      case StatusCode.Duplicate:
        message = 'Duplicate';
        break;

      case StatusCode.EmailNotConfirmed:
        message = 'EmailNotConfirmed';
        break;

      case StatusCode.EmailUsed:
        message = 'Email has already been used';
        break;

      case StatusCode.Error:
        message = 'Error';
        break;

      case StatusCode.Expired:
        message = 'Expired';
        break;

      case StatusCode.IncorrectLoginOrPassword:
        message = 'Incorrect login or password';
        break;

      case StatusCode.IncorrectVerificationCode:
        message = 'IncorrectVerificationCode';
        break;

      case StatusCode.LinkHasAlreadyBeenSent:
        message = 'Link has already been sent';
        break;

      case StatusCode.NotAvailable:
        message = 'Table is not available';
        break;

      case StatusCode.NotFound:
        message = 'Not found';
        break;

      case StatusCode.Handled:
        message = 'Request has already been handled';
        break;

      default:
        message = 'Error';
        break;
    }
    this.openErrorDialog(message);
  }

  openErrorDialog(message: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      data:
      {
        type: ConfirmationType.Error,
        message
      }
    });
  }
}
