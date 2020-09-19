import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from 'src/app/core/services/client.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MouseEvent } from '@agm/core';
import { ServerResponseGeneric, StatusCode, ServerResponse } from 'src/app/core/models/server-response';
import { ClientInfoFull } from 'src/app/core/models/client-info-full';
import { OrganizationInfo } from 'src/app/core/models/organization-info';
import { ClientParameterInfo } from 'src/app/core/models/client-parameter-info';
import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
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
import { NewClientCharacteristics } from 'src/app/core/models/new-client-characteristics';
import { CustomErrorStateMatcher } from 'src/app/Utils/CustomErrorStateMatcher';
import { NewAdminComponent } from 'src/app/Utils/new-admin/new-admin.component';
import { GeoLocationService } from 'src/app/core/services/geo-location.service';
import { ErrorService } from 'src/app/core/services/error.service';
import { NewParameterComponent } from 'src/app/Utils/new-parameter/new-parameter.component';
import { first } from 'rxjs/operators';

export class WeekDay {
  constructor(public id: number, public title: string) { }
}

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [GeoLocationService]
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

  clientTypeSelected = [];
  mealTypesSelected = [];
  dishesSelected = [];
  goodForSelected = [];
  cuisinesSelected = [];
  specialDietSelected = [];
  featuresSelected = [];
  dayOffSelected = [];

  dayOffArray: WeekDay[] = [
    new WeekDay(1, 'Monday'),
    new WeekDay(2, 'Tuesday'),
    new WeekDay(3, 'Wednesday'),
    new WeekDay(4, 'Thursday'),
    new WeekDay(5, 'Friday'),
    new WeekDay(6, 'Saturday'),
    new WeekDay(7, 'Sunday'),
  ];

  parameterTypes: string[] = [
    'clientType',
    'cuisine',
    'dish',
    'goodFor',
    'specialDiet',
    'feature',
  ];

  settingIdArray = [
    'maxReserveDaysId',
    'reserveDurationAvgId',
    'confirmationDurationId',
    'barReserveDurationAvgId',
  ];

  phones: ClientPhoneInfo[] = [];
  links: SocialLink[] = [];

  isBarReservation = false;
  barReservationId = 0;

  lat = 0;
  long = 0;

  logo: string;
  logoString: string = null;

  screenOptions = {
    position: 3
  };

  galleryImages: ClientImageInfo[] = [];
  mainImage: string;

  clientId: number;

  numberFocus = false;

  matcher = new CustomErrorStateMatcher();

  numberMask = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];

  timeMask = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private parameterService: ParameterService,
    public router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ShowPictureComponent>,
    private dialogConfirmRef: MatDialogRef<ConfirmationDialogComponent>,
    private sanitizer: DomSanitizer,
    public loadingService: LoadingService,
    private geoServ: GeoLocationService,
    private errorService: ErrorService
  ) { }

  ngOnInit() {
    this.loadingService.setIsLoading(true);

    this.route.params.forEach((params) => {
      this.clientId = +params.id;
    });

    forkJoin(

      this.parameterService.getCuisines(),
      this.parameterService.getClientTypes(),
      this.parameterService.getMealTypes(),
      this.parameterService.getDishes(),
      this.parameterService.getGoodFors(),
      this.parameterService.getSpecialDiets(),
      this.parameterService.getFeatures(),
      this.clientService.getClientFullInfo(this.clientId)
    ).subscribe(
      (result: any) => {
        this.cuisines = result[0].data;
        this.clientTypes = result[1].data;
        this.mealTypes = result[2].data;
        this.dishes = result[3].data;
        this.goodFors = result[4].data;
        this.specialDiets = result[5].data;
        this.features = result[6].data;
        this.client = result[7].data;

        const feature = this.features.find(
          (item) => item.title.toLocaleUpperCase() === 'BAR RESERVATION'
        );

        if (!isUndefined(feature)) {
          this.barReservationId = feature.id;
          if (
            this.client != null &&
            this.client.characteristics != null
          ) {
            if (
              this.client.characteristics.featureIds.includes(
                this.barReservationId
              )
            ) {
              this.isBarReservation = true;
              this.clientForm.addControl(
                'barReserveDurationAvg',
                new FormControl(
                  this.client.characteristics.barReserveDurationAvg,
                  Validators.required
                )
              );
            } else {
              this.isBarReservation = false;
              // this.clientForm.removeControl('barReserveDurationAvg');
            }
          }
        }

        this.setClientProperties();
        this.loadingService.setIsLoading(false);
      },
      (error) => {
        console.log(error);
        this.loadingService.setIsLoading(false);
      }
    );

    // this.numbers = this.clientForm.value.numbers;
    // this.socialLinks = this.clientForm.value.socialLinks;
  }

  setClientProperties() {
    let openTime = null;
    let closeTime = null;
    if (this.client.characteristics != null) {
      openTime = moment()
        .utc()
        .startOf('day')
        .add(this.client.characteristics.openTime, 'minutes')
        .local();
      closeTime = moment
        .utc()
        .startOf('day')
        .add(this.client.characteristics.closeTime, 'minutes')
        .local();
    }

    console.log('close');

    this.clientForm = this.fb.group({
      restaurantName: [this.client.clientName, Validators.required],

      address: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.address,
        Validators.required,
      ],
      openTime: [
        this.client.characteristics == null ? '' : openTime.format('HH:mm'),
      ],
      closeTime: [
        this.client.characteristics == null ? '' : closeTime.format('HH:mm'),
      ],
      dayOffs: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.dayOffs,
      ],
      mealTypeIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.mealTypeIds,
        Validators.required,
      ],
      clientTypeIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.clientTypeIds,
      ],
      cuisineIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.cuisineIds,
      ],
      specialDietIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.specialDietIds,
      ],
      goodForIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.goodForIds,
      ],
      dishIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.dishIds,
      ],
      featureIds: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.featureIds,
        Validators.required,
      ],
      priceCategory: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.priceCategory,
        Validators.required,
      ],

      maxReserveDays: [
        this.client.characteristics == null
          ? 1
          : this.client.characteristics.maxReserveDays,
        Validators.required,
      ],

      reserveDurationAvg: [
        this.client.characteristics == null
          ? 120
          : this.client.characteristics.reserveDurationAvg,
        [
          Validators.required,
          Validators.min(30),
          Validators.pattern(/^([1-9])([0-9]+)$/),
        ],
      ],
      confirmationDuration: [
        this.client.characteristics == null
          ? 15
          : this.client.characteristics.confirmationDuration,
        [Validators.required, Validators.min(15)],
      ],
      description: [
        this.client.characteristics == null
          ? ''
          : this.client.characteristics.description,
      ],
    });

    this.galleryImages = this.client.images;
    if (this.client.images.length > 0) {
      const mainImgIndex = this.client.images.findIndex((item) => item.isMain);

      if (mainImgIndex !== -1) {
        this.galleryImages.splice(
          0,
          0,
          this.galleryImages.splice(mainImgIndex, 1)[0]
        );
      }
    }

    this.logo = this.client.logoPath;

    if (this.client.characteristics != null) {
      this.lat = this.client.characteristics.lat;
      this.long = this.client.characteristics.long;

      this.phones = [];
      this.client.characteristics.phones.forEach((element) => {
        this.phones.push(
          new ClientPhoneInfo(
            element.number,
            element.isWhatsApp,
            element.isTelegram
          )
        );
      });

      this.links = [];
      this.client.characteristics.socialLinks.forEach((element) => {
        this.links.push(new SocialLink(element));
      });

      this.clientTypeSelected = [];
      this.mealTypesSelected = [];
      this.cuisinesSelected = [];
      this.specialDietSelected = [];
      this.goodForSelected = [];
      this.dishesSelected = [];
      this.featuresSelected = [];

      this.client.characteristics.clientTypeIds.forEach((item) => {
        this.clientTypeSelected.push(item);
      });

      this.client.characteristics.mealTypeIds.forEach((item) => {
        this.mealTypesSelected.push(item);
      });

      this.client.characteristics.cuisineIds.forEach((item) => {
        this.cuisinesSelected.push(item);
      });

      this.client.characteristics.specialDietIds.forEach((item) => {
        this.specialDietSelected.push(item);
      });

      this.client.characteristics.goodForIds.forEach((item) => {
        this.goodForSelected.push(item);
      });

      this.client.characteristics.dishIds.forEach((item) => {
        this.dishesSelected.push(item);
      });

      this.client.characteristics.featureIds.forEach((item) => {
        this.featuresSelected.push(item);
      });

      this.client.characteristics.dayOffs.forEach((item) => {
        this.dayOffSelected.push(item);
      });

      if (this.barReservationId !== 0) {
        if (
          this.client.characteristics.featureIds.includes(this.barReservationId)
        ) {
          this.isBarReservation = true;
          this.clientForm.addControl(
            'barReserveDurationAvg',
            new FormControl(
              this.client.characteristics.barReserveDurationAvg,
              Validators.required
            )
          );
        } else {
          this.isBarReservation = false;
        }
      }
    }
  }

  getCurrentLocation() {
    this.geoServ.getPosition().then((pos) => {
      this.lat = pos.lat;
      this.long = pos.long;
    });
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
      const len = bytes.byteLength;
      for (let j = 0; j < len; j++) {
        binary += String.fromCharCode(bytes[j]);
      }
      this.logoString = window.btoa(binary);

      fileInput = null;
    });

    fileInput.click();
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






  addNumber() {
    if (this.phones.length < 4) {
      this.phones.push(new ClientPhoneInfo('', false, false));
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
          if (result.statusCode === StatusCode.Ok) {
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

      const socialLinks = [];
      this.links.forEach((element) => {
        socialLinks.push(element.link);
      });

      const openDate = moment(
        `${new Date().toLocaleDateString()} ${this.clientForm.value.openTime}`,
        'MM/DD/YYYY HH:mm'
      );
      const closeDate = moment(
        `${new Date().toLocaleDateString()} ${this.clientForm.value.closeTime}`,
        'MM/DD/YYYY HH:mm'
      );

      this.phones.forEach((element) => {
        element.number = this.replaceAll(element.number, [' ', '_', '+'], '');

        element.number = `+${element.number}`;
      });

      const newCharacts = new NewClientCharacteristics(
        this.clientForm.value.address,
        this.lat,
        this.long,
        openDate.format(),
        closeDate.format(),
        this.clientForm.value.dayOffs,
        this.clientForm.value.description,
        this.clientForm.value.maxReserveDays,
        this.clientForm.value.reserveDurationAvg,
        this.isBarReservation
          ? this.clientForm.value.barReserveDurationAvg
          : null,
        this.clientForm.value.confirmationDuration,
        this.clientForm.value.priceCategory,
        '123',
        socialLinks,
        this.clientForm.value.clientTypeIds,
        this.clientForm.value.mealTypeIds,
        this.clientForm.value.cuisineIds,
        this.clientForm.value.dishIds,
        this.clientForm.value.goodForIds,
        this.clientForm.value.specialDietIds,
        this.clientForm.value.featureIds,
        this.phones
      );

      const updateClientRequest = new UpdateClientRequest(
        this.clientId,
        this.clientForm.value.restaurantName,
        this.logoString,
        newCharacts
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
      );
    }
  }

  showTooltip(array, origArray) {
    let res = '';
    const length = array.length;
    array.forEach((element, index) => {
      res +=
        origArray.find((ar) => ar.id === element).title +
        (index < length - 1 ? ', ' : '');
    });

    return res;
  }

  scrollTo(elem) {
    elem.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  showLogo() {
    this.dialogRef = this.dialog.open(ShowPictureComponent, {
      data: {
        logoPath: this.logo,
        galleryImage: null,
        isLogo: true,
        imagePathsArray: '',
      },
    });
  }

  validateTime(time) {
    const re = /^[0-2][0-9]:[0-5][0-9]$/;
    return re.test(time);
  }

  timeStart24Check(event) {
    const timeValidate = event.target.value;
    if (this.validateTime(timeValidate)) {
      console.log('Start good');
    }
  }

  timeEnd24Check(event) {
    const timeValidate = event.target.value;
    if (this.validateTime(timeValidate)) {
      console.log('End good');
    }
  }

  timeStartValidCheck(event) {
    if (
      event.target.value[0] === '2' &&
      +event.target.selectionEnd === 1 &&
      +event.key > 3
    ) {
      return false;
    }
  }

  timeEndValidCheck(event) {
    if (
      event.target.value[0] === '2' &&
      +event.target.selectionEnd === 1 &&
      +event.key > 3
    ) {
      return false;
    }
  }

  socialLinkCheck(id) {
    if (this.links[id].link !== '') {
      document
        .getElementById('addSocialLinkButton')
        .removeAttribute('disabled');
    } else {
      document
        .getElementById('addSocialLinkButton')
        .setAttribute('disabled', '');
    }
  }

  numberCheck(id) {
    if (this.phones[id].number !== '') {
      document.getElementById('addNumberButton').removeAttribute('disabled');
    } else {
      document.getElementById('addNumberButton').setAttribute('disabled', '');
    }
  }

  editAdmin(item) {
    console.log(item);
    setTimeout(() => {
      const dialogRef = this.dialog.open(NewAdminComponent, {
        data: item,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (!isUndefined(dialogResult)) {

          // add new or update ClientAdmin

        }
        console.log(dialogResult);
      });
    });
  }

  addParam(selectedTypeIndex: number) {
    setTimeout(() => {
      const dialogNewParameter = this.dialog.open(NewParameterComponent, {
        disableClose: true,
        data: selectedTypeIndex,
      });

      dialogNewParameter.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.parameterService
            .addParameter(dialogResult, this.parameterTypes[selectedTypeIndex])
            .pipe(first())
            .subscribe(
              (result: ServerResponseGeneric<ClientParameterInfo>) => {
                if (result.statusCode === StatusCode.Ok) {
                  switch (selectedTypeIndex) {
                    case 0:
                      this.clientTypes.push(result.data);
                      this.clientTypes.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                    case 1:
                      this.cuisines.push(result.data);
                      this.cuisines.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                    case 2:
                      this.dishes.push(result.data);
                      this.dishes.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                    case 3:
                      this.goodFors.push(result.data);
                      this.goodFors.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                    case 4:
                      this.specialDiets.push(result.data);
                      this.specialDiets.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                    case 5:
                      this.features.push(result.data);
                      this.features.sort((item1, item2) => item1.title.localeCompare(item2.title));
                      break;
                  }
                } else {
                  this.errorService.handleServerResponse(result.statusCode);
                }
              },
              (error) => {
                this.errorService.openErrorDialog('Some error occured');
              }
            );
        }
      });
    });
  }


  onEnterCatchKeyDown(event, index) {
    if (event.key === 'Enter') {
      if (index === 3) {
        if (!this.isBarReservation) {
          document.getElementById(this.settingIdArray[index - 1]).blur();
          return false;
        }
      }

      if (index === -1) {
        document
          .getElementById(this.settingIdArray[this.settingIdArray.length - 1])
          .blur();
        return false;
      }

      document.getElementById(this.settingIdArray[index]).focus();
      return false;
    }
  }

  resetEdit() {
    this.setClientProperties();
    document.getElementById('addNumberButton').removeAttribute('disabled');
  }

  replaceAll(
    sourceString: string,
    searchCharArray: string[],
    replaceChar: string
  ) {
    searchCharArray.forEach((element) => {
      sourceString = sourceString.split(element).join(replaceChar);
    });

    return sourceString;
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
              this.client.confirmedByAdmin = new Date();
              alert('Client has been confirmed');

            } else {
              alert(result.statusCode);
            }
          }
        );
      }
    }

    );
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
        );
      }
    }

    );
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
        );
      }
    });
  }



}
