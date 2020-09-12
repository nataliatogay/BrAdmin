import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/core/services/client.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MouseEvent } from '@agm/core';
import { ServerResponseGeneric, StatusCode, ServerResponse } from 'src/app/core/models/server-response';
import { ClientInfoFull } from 'src/app/core/models/client-info-full';
import { OrganizationInfo } from 'src/app/core/models/organization-info';
import { ClientParameterInfo } from 'src/app/core/models/client-parameter-info';
import { forkJoin, Observable } from 'rxjs';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { isUndefined } from 'util';
import { ClientPhoneInfo } from 'src/app/core/models/client-phone-info';
import { SocialLink } from '../new-client/new-client.component';
import { UpdateClientRequest } from 'src/app/core/models/update-client-request';
import { ConfirmationDialogComponent } from 'src/app/Utils/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationType } from 'src/app/core/models/confirmation-type';
import { UploadMainImageRequest } from 'src/app/core/models/upload-main-image-request';
import { ShowPictureComponent } from 'src/app/Utils/show-picture/show-picture.component';
import { UploadImagesRequest } from 'src/app/core/models/upload-images-request';
import { ClientImageInfo } from 'src/app/core/models/client-image-info';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {

  clientForm: FormGroup;
  client: ClientInfoFull;

  organizations: OrganizationInfo[] = [];
  priceCategories = [1, 2, 3, 4];
  cuisines: ClientParameterInfo[] = [];
  clientTypes: ClientParameterInfo[] = [];
  mealTypes: ClientParameterInfo[] = [];
  dishes: ClientParameterInfo[] = [];
  goodFors: ClientParameterInfo[] = [];
  specialDiets: ClientParameterInfo[] = [];
  features: ClientParameterInfo[] = [];

  phones: ClientPhoneInfo[] = [];
  links: SocialLink[] = [];

  isBarReservation: boolean = false;
  barReservationId: number = 0;

  lat: number = 0;
  long: number = 0;

  screenOptions = {
    position: 3
  };

  galleryImages: ClientImageInfo[] = [];
  mainImage: string;

  clientId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private organizationService: OrganizationService,
    private parameterService: ParameterService,
    public router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ShowPictureComponent>,
    private dialogConfirmRef: MatDialogRef<ConfirmationDialogComponent>,
    private sanitizer: DomSanitizer,
    public loadingService: LoadingService,
    // private geoServ: GeoLocationService
  ) { }

  ngOnInit() {
    this.loadingService.setIsLoading(true);

    this.route.params.forEach((params) => {
      this.clientId = +params['id'];


      this.clientService.getClientFullInfo(this.clientId).subscribe(
        (result: ServerResponseGeneric<ClientInfoFull>) => {
          if (result.statusCode == StatusCode.Ok) {
            this.client = result.data;

            console.log(this.client)

            this.clientForm = this.fb.group({

              restaurantName: [this.client.clientName],
              adminName: [this.client.adminName],
              adminPhoneNumber: [this.client.adminPhoneNumber],
              mainImagePath: [this.client.mainImagePath],
              openTime: [this.parseIntToTime(this.client.openTime)],
              closeTime: [this.parseIntToTime(this.client.closeTime)],
              phones: [this.client.phones],
              socialLinks: [this.client.socialLinks],
              mealTypeIds: [this.client.mealTypeIds],
              clientTypeIds: [this.client.clientTypeIds],
              cuisineIds: [this.client.cuisineIds],
              specialDietIds: [this.client.specialDietIds],
              goodForIds: [this.client.goodForIds],
              dishIds: [this.client.dishIds],
              featureIds: [this.client.featureIds],
              priceCategory: [this.client.priceCategory],
              maxReserveDays: [this.client.maxReserveDays],
              reserveDurationAvg: [this.client.reserveDurationAvg],
              barReserveDurationAvg: [this.client.barReserveDurationAvg],
              confirmationDuration: [this.client.confirmationDuration],
              description: [this.client.description]
            });

            this.galleryImages = this.client.images;
            this.mainImage = this.client.mainImagePath;
            this.lat = this.client.lat;
            this.long = this.client.long;
            this.phones = this.client.phones;
            this.client.socialLinks.forEach(element => {
              this.links.push(new SocialLink(element));
            });

            this.loadingService.setIsLoading(false);

          } else {
            this.router.navigate(['clients']);
          }
        }
      )
    });

    forkJoin(
      this.organizationService.getOrganizations(),
      this.parameterService.getCuisines(),
      this.parameterService.getClientTypes(),
      this.parameterService.getMealTypes(),
      this.parameterService.getDishes(),
      this.parameterService.getGoodFors(),
      this.parameterService.getSpecialDiets(),
      this.parameterService.getFeatures()
    ).subscribe(
      (result: any) => {
        this.organizations = result[0].data,
          this.cuisines = result[1].data;
        this.clientTypes = result[2].data;
        this.mealTypes = result[3].data;
        this.dishes = result[4].data;
        this.goodFors = result[5].data;
        this.specialDiets = result[6].data;
        this.features = result[7].data;

        let feature = this.features.find(item => item.title.toLocaleUpperCase() === "BAR RESERVATION");
        if (!isUndefined(feature)) {

          this.barReservationId = feature.id;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    // this.numbers = this.clientForm.value.numbers;
    // this.socialLinks = this.clientForm.value.socialLinks;


  }



  featureSelectionChange(val: Array<number>) {
    console.log(val);
    console.log(this.barReservationId);
    if (val.includes(this.barReservationId)) {
      this.isBarReservation = true;
    } else {
      this.isBarReservation = false;
    }
  }


  parseIntToTime(time: number) {
    let mins = time % 60;
    let hours = (time - mins) / 60;

    let hourString = (hours < 10 ? '0' : '') + hours;
    let minsString = (mins < 10 ? '0' : '') + mins;
    return hourString + ':' + minsString;
  }



  parseTimeToInt(time: string) {
    let hours = +time.substr(0, time.length - time.indexOf(':') - 1);
    let min = +time.substr(time.indexOf(':') + 1);
    return hours * 60 + min;
  }



  addNumber() {
    if (this.phones.length < 4) {
      this.phones.push(new ClientPhoneInfo('', false));
    }
  }

  removeNumber(num) {
    this.phones.splice(this.phones.findIndex(n => n === num), 1);
  }

  addSocLink() {
    if (this.links.length < 4) {
      this.links.push(new SocialLink(''));
    }
  }

  removeSocLink(soc) {
    this.links.splice(this.links.findIndex(l => l === soc), 1);
  }




  // deletePic(pic) {
  //   this.galleryImages.splice(this.galleryImages.findIndex(p => p === pic), 1);
  //   this.clientForm.value.pictures = this.galleryImages;
  // }

  showMainImage() {
    this.dialogRef = this.dialog.open(ShowPictureComponent, {
      data: {
        mainImagePath: this.mainImage,
        galleryImage: null,
        isMainImage: true,
        imagePathsArray: '',
        clientId: this.clientId
      }
    });

    this.dialogRef.afterClosed().subscribe(dialogResult => {
      if (!isUndefined(dialogResult)) {
        switch (dialogResult.event) {

          case 'uploadMainImage':
            if (dialogResult.data != null) {
              this.clientService.uploadMainImage(new UploadMainImageRequest(this.clientId, dialogResult.data)).subscribe(
                (result: ServerResponseGeneric<string>) => {
                  if (result.statusCode === StatusCode.Ok) {
                    this.mainImage = result.data;
                    alert('Main image has been changed successfully');
                  } else {
                    alert(result.statusCode);
                  }
                }
              );
            }

            break;



        }
      }
    })
  }




  showGalleryImage(galleryImage: ClientImageInfo) {

    this.dialogRef = this.dialog.open(ShowPictureComponent, {
      data: {
        galleryImage: galleryImage,
        isMainImage: false,
        imagePathsArray: this.galleryImages,
        clientId: this.clientId
      }
    });

    this.dialogRef.afterClosed().subscribe(dialogResult => {
      if (!isUndefined(dialogResult)) {


        switch (dialogResult.event) {


          case 'setAsMain':
            if (dialogResult.data != null) {
              this.clientService.setAsMainImage(dialogResult.data.id).subscribe(
                (result: ServerResponse) => {
                  if (result.statusCode === StatusCode.Ok) {
                    this.galleryImages.splice(this.galleryImages.findIndex(item => item.id === dialogResult.data.id), 1);
                    this.mainImage = dialogResult.data.path;
                    alert('Main image has been changed successfully');
                  } else {
                    alert(result.statusCode);
                  }
                }
              );
            }

            break;

          case 'deleteGalleryImage':
            if (dialogResult.data != null) {
              this.clientService.deleteImage(dialogResult.data).subscribe(
                (result: ServerResponse) => {
                  if (result.statusCode === StatusCode.Ok) {
                    this.galleryImages.splice(this.galleryImages.findIndex(item => item.id === dialogResult.data), 1);
                    alert('Image has been deleted');
                  } else {
                    alert(result.statusCode);
                  }
                }
              )
            }
            break;
        }
      }
      this.dialogRef = null;
    });
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  uploadImages() {

    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.setAttribute('accept', 'image/*');
    fileInput.setAttribute('multiple', '');


    fileInput.addEventListener('change', async event => {
      const target = event.target as HTMLInputElement;
      const selectedFiles = target.files;

      var stringArray = [];

      for (let i = 0; i < selectedFiles.length; ++i) {
        let res = await this.readFileAsync(selectedFiles[i]);
        console.log(res);
        var binary = '';
        var bytes = new Uint8Array(res as ArrayBuffer);
        console.log(bytes);
        var len = bytes.byteLength;
        for (var j = 0; j < len; j++) {
          binary += String.fromCharCode(bytes[j]);
        }
        stringArray.push(window.btoa(binary));
        console.log(window.btoa(binary));
        // this.galleryImages.push(URL.createObjectURL(selectedFiles[i]));

      }


      // console.log(stringArray[0]);

      this.clientForm.value.pictures = this.galleryImages;

      fileInput = null;

      this.clientService.uploadImages(new UploadImagesRequest(this.client.id, stringArray)).subscribe(
        (result: ServerResponseGeneric<ClientImageInfo[]>) => {
          if (result.statusCode == StatusCode.Ok) {
            this.galleryImages = result.data;
            alert(result.statusCode);
          } else {
            alert(result.statusCode);
          }
        }
      )
    });

    fileInput.click();
  }

  convertImage(imageFile: File) {
    var binary = '';
    var fileReader = new FileReader();

    fileReader.onload = function () {

      let imageData = fileReader.result;

      var bytes = new Uint8Array(imageData as ArrayBuffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      console.log(binary);
    };
    fileReader.readAsArrayBuffer(imageFile);
    console.log('end');
    console.log(binary);
    return window.btoa(binary);

  }



  readFileAsync(file) {
    var binary = '';
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;

      reader.onload = () => {

        resolve(reader.result);

      };
      reader.readAsArrayBuffer(file);

    })
  }


  markerDragEnd($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.long = $event.coords.lng;
  }

  onSubmit() {

    let socialLinks = [];
    this.links.forEach(element => {
      socialLinks.push(element.link);
    });

    if (this.clientForm.valid) {

      let updateClientRequest = new UpdateClientRequest(
        this.clientId,
        this.clientForm.value.restaurantName,
        this.lat,
        this.long,
        this.parseTimeToInt(this.clientForm.value.openTime),
        this.parseTimeToInt(this.clientForm.value.closeTime),
        this.clientForm.value.description,
        this.clientForm.value.maxReserveDays,
        this.clientForm.value.reserveDurationAvg,
        this.isBarReservation ? this.clientForm.value.barReserveDurationAvg : null,
        this.clientForm.value.confirmationDuration,
        this.clientForm.value.priceCategory,
        socialLinks,
        this.clientForm.value.cuisineIds,
        this.clientForm.value.clientTypeIds,
        this.clientForm.value.mealTypeIds,
        this.clientForm.value.dishIds,
        this.clientForm.value.goodForIds,
        this.clientForm.value.specialDietIds,
        this.clientForm.value.featureIds,
        this.phones
      );

      console.log(updateClientRequest);

      this.clientService.updateClient(updateClientRequest).subscribe(
        (result: ServerResponse) => {
          if (result.statusCode === StatusCode.Ok) {
            alert('Success');
            this.router.navigate[''];
          } else {
            alert(result.statusCode);
          }
        }
      )
    }
  }

  confirmClient() {
    this.dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: `Client \'${this.client.clientName}\' will be added to BR system`,
        title: 'Confirmation'
      }
    });

    this.dialogConfirmRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.clientService.confirmClient(this.client.id).subscribe(
          (result: ServerResponse) => {
            if (result.statusCode === StatusCode.Ok) {
              this.client.confirmed = new Date();
              alert('Client has been confirmed');

            } else {
              alert(result.statusCode);
            }
          }
        )
      }
    }

    )
  }


  blockClient() {
    this.dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: `Client \'${this.client.clientName}\' will be blocked`,
        title: 'Confirmation'
      }
    });

    this.dialogConfirmRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.clientService.blockClient(this.client.id).subscribe(
          (result: ServerResponse) => {
            if (result.statusCode === StatusCode.Ok) {
              this.client.blocked = new Date();
              alert('Client has been blocked');

            } else {
              alert(result.statusCode);
            }
          }
        )
      }
    }

    )
  }



  unblockClient() {
    this.dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data:
      {
        type: ConfirmationType.Confirmation,
        message: `Client \'${this.client.clientName}\' will be unblocked`,
        title: 'Confirmation'
      }
    });

    this.dialogConfirmRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult) {
        this.clientService.unblockClient(this.client.id).subscribe(
          (result: ServerResponse) => {
            if (result.statusCode === StatusCode.Ok) {
              this.client.blocked = null;
              alert('Client has been unblocked');

            } else {
              alert(result.statusCode);
            }
          }
        )
      }
    });
  }



}
