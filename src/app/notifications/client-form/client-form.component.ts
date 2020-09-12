import { Component, OnInit, Inject } from '@angular/core';
import { isUndefined } from 'util';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ClientInfoShort } from 'src/app/core/models/client-info-short';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ShowPictureComponent } from 'src/app/Utils/show-picture/show-picture.component';
import { OwnerInfo } from 'src/app/core/models/owner-info';
import { OwnerRequestInfo } from 'src/app/core/models/owner-request-info';
import { ClientAdminInfo } from 'src/app/core/models/client-admin-info';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
})
export class ClientFormComponent implements OnInit {
  newClientTitle = '';
  logo: string;
  logoString: string = null;
  admin: ClientAdminInfo = null;


  constructor(
    public loadingService: LoadingService,
    public dialogVenue: MatDialogRef<ClientFormComponent>,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ClientInfoShort
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.newClientTitle = this.data.clientName;
    if (this.data.admins.length > 0) {
      this.admin = this.data.admins[0];
    }
    this.logo = this.data.logoPath;
  }

  showLogo() {
    const dialogRef = this.dialog.open(ShowPictureComponent, {
      data: {
        logoPath: this.logo,
        galleryImage: null,
        isLogo: true,
        imagePathsArray: '',
      },
    });
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    if (isUndefined(imageUrl)) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  uploadLogo() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.setAttribute('accept', 'image/*');

    fileInput.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      this.logo = URL.createObjectURL(selectedFile);
      const res = await this.readFileAsync(selectedFile);
      let binary = '';
      const bytes = new Uint8Array(res as ArrayBuffer);
      for (let j = 0; j < bytes.byteLength; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
      this.logoString = window.btoa(binary);

      fileInput = null;
    });

    fileInput.click();
  }

  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;

      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  confirmClient() {
    this.dialogVenue.close(true);

  }
}
