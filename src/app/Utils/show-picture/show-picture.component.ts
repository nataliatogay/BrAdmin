import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from 'src/app/Utils/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationType } from 'src/app/core/models/confirmation-type';
import { ClientService } from 'src/app/core/services/client.service';
import { ClientImageInfo } from 'src/app/core/models/client-image-info';

export interface PictureComponentData {
  mainImagePath: string;
  galleryImage: ClientImageInfo;
  isMainImage: boolean;
  imagePathsArray: ClientImageInfo[];
  clientId: number;

}

@Component({
  selector: 'app-show-picture',
  templateUrl: './show-picture.component.html',
  styleUrls: ['./show-picture.component.css']
})

export class ShowPictureComponent implements OnInit {

  selectedNewMainImage: File;

  currentGalleryImage: ClientImageInfo;

  src: string;
  galleryImages: ClientImageInfo[] = [];
  currentGalleryImageIndex: number;
  ifSave = false;

  constructor(
    private clientService: ClientService,

    @Inject(MAT_DIALOG_DATA) public data: PictureComponentData,
    private sanitizer: DomSanitizer,
    private dialogRefSelf: MatDialogRef<ShowPictureComponent>,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.src = this.data.galleryImage == null ? this.data.mainImagePath : this.data.galleryImage.path;
    if (!this.data.isMainImage) {
      this.galleryImages = this.data.imagePathsArray;
      this.currentGalleryImageIndex = this.galleryImages.findIndex(img => img.id === this.data.galleryImage.id);
    }
    //this.currentGalleryImage = this.data.image;

  }

  setMain() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: 'This image will be set as main and be removed from gallery.',
        title: 'Confirmation'
      }
    });


    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRefSelf.close({ event: 'setAsMain', data: this.galleryImages[this.currentGalleryImageIndex] });
      }

      this.dialogRef = null;
    });
  }

  delete() {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: 'This image will be removed from gallery.',
        title: 'Confirmation'
      }
    });


    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.galleryImages[this.currentGalleryImageIndex].id);
        this.dialogRefSelf.close({ event: 'deleteGalleryImage', data: this.galleryImages[this.currentGalleryImageIndex].id });
      }

      this.dialogRef = null;
    });
  }

  changePicKey(ev) {
    if (ev.key === 'ArrowRight') {
      this.changePic(true);
    } else if (ev.key === 'ArrowLeft') {
      this.changePic(false);
    }
  }

  changePic(dir) {
    const lastPos = this.galleryImages.length - 1;

    if (dir) {
      if (this.currentGalleryImageIndex === lastPos) {
        this.currentGalleryImageIndex = 0;
      } else {
        this.currentGalleryImageIndex++;
      }
    } else {
      if (this.currentGalleryImageIndex === 0) {
        this.currentGalleryImageIndex = lastPos;
      } else {
        this.currentGalleryImageIndex--;
      }
    }

    this.src = this.galleryImages[this.currentGalleryImageIndex].path;
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  uploadMainImage() {

    if (this.selectedNewMainImage != null) {
      var binary = '';
      let dialogRef = this.dialogRefSelf;
      var fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.selectedNewMainImage);
      fileReader.onload = function () {

        let imageData = fileReader.result;
        console.log(imageData);

        var bytes = new Uint8Array(imageData as ArrayBuffer);
        console.log(bytes);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        console.log(window.btoa(binary));


        dialogRef.close({ event: 'uploadMainImage', data: window.btoa(binary) });





        // document.getElementById('imageByteArr').value = window.btoa(binary);

      };

      console.log(fileReader.readyState);




    }



  }

  uploadNewMainImage() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.setAttribute('accept', 'image/*');

    fileInput.addEventListener('change', event => {

      const target = event.target as HTMLInputElement;
      const selectedFile = target.files[0];
      this.selectedNewMainImage = selectedFile;
      this.src = URL.createObjectURL(selectedFile);
      this.ifSave = true;
      fileInput = null;
    });

    fileInput.click();
  }
}
