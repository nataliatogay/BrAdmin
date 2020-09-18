import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OrganizationInfo } from 'src/app/core/models/organization-info';
import { ClientParameterInfo } from 'src/app/core/models/client-parameter-info';
import { forkJoin } from 'rxjs';
import { ParameterService } from 'src/app/core/services/parameter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientPhoneInfo } from 'src/app/core/models/client-phone-info';
import { GeoLocationService } from 'src/app/core/services/geo-location.service';
import { MouseEvent } from '@agm/core';
import { NewClientRequest } from 'src/app/core/models/new-client-request';
import { isUndefined } from 'util';

export class SocialLink {
  constructor(public link: string) { }
}

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css'],
  providers: [GeoLocationService]
})
export class NewClientComponent implements OnInit {

  clientForm: FormGroup;

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

  constructor(
    private parameterService: ParameterService,
    private fb: FormBuilder,

    private dialogRef: MatDialogRef<NewClientComponent>,

    private geolocationService: GeoLocationService
  ) { }

  ngOnInit() {

    forkJoin(
      this.parameterService.getCuisines(),
      this.parameterService.getClientTypes(),
      this.parameterService.getMealTypes(),
      this.parameterService.getDishes(),
      this.parameterService.getGoodFors(),
      this.parameterService.getSpecialDiets(),
      this.parameterService.getFeatures()
    ).subscribe(
      (result: any) => {
          this.cuisines = result[0].data;
        this.clientTypes = result[1].data;
        this.mealTypes = result[2].data;
        this.dishes = result[3].data;
        this.goodFors = result[4].data;
        this.specialDiets = result[5].data;
        this.features = result[6].data;

        const feature = this.features.find(item => item.title.toLocaleUpperCase() === 'BAR RESERVATION');
        if (!isUndefined(feature)) {

          this.barReservationId = feature.id;
        }
      },
      (error) => {
        console.log(error);
      }
    );



    this.phones.push(new ClientPhoneInfo('', false, false));
    this.links.push(new SocialLink(''));

    this.clientForm = this.fb.group(
      {
        restaurantName: ['', Validators.required],
        email: ['', Validators.required],
        adminName: ['', Validators.required],
        adminPhoneNumber: ['', Validators.required],
        organizationId: ['', Validators.required],
        openTime: ['', Validators.required],
        closeTime: ['', Validators.required],
        description: [''],
        maxReserveDays: [1, Validators.required],
        reserveDurationAvg: [120, Validators.required],
        barReserveDurationAvg: [120],
        confirmationDuration: [15, Validators.required],
        priceCategory: ['', Validators.required],
        cuisineIds: [''],
        clientTypeIds: ['', Validators.required],
        mealTypeIds: ['', Validators.required],
        dishIds: [''],
        goodForIds: [''],
        specialDietIds: [''],
        featureIds: ['']

      }
    );

    this.geolocationService.getPosition().subscribe(
      (pos: Position) => {
        this.lat = this.clientForm.value.lat = +(pos.coords.latitude);
        this.long = this.clientForm.value.long = +(pos.coords.longitude);
      }
    );

  }

  onSubmit() {

    let socialLinks = [];
    this.links.forEach(element => {
      socialLinks.push(element.link);
    });
    console.log(this.parseTime(this.clientForm.value.openTime));

    if (this.clientForm.valid) {

      let newClientRequest = new NewClientRequest(
        this.clientForm.value.organizationId,
        this.clientForm.value.restaurantName,
        this.clientForm.value.email,
        this.clientForm.value.adminName,
        this.clientForm.value.adminPhoneNumber,
        this.lat,
        this.long,
        this.parseTime(this.clientForm.value.openTime),
        this.parseTime(this.clientForm.value.closeTime),
        this.clientForm.value.description,
        null,
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
      )
      this.dialogRef.close({ data: newClientRequest });
    }
  }

  cancelWindow() {
    this.dialogRef.close(false);
  }












  parseTime(time: string) {
    const hours = +time.substr(0, time.length - time.indexOf(':') - 1);
    const min = +time.substr(time.indexOf(':') + 1);
    return hours * 60 + min;
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

  getCurrentLocation() {
    this.lat = this.geolocationService.coordinates.coords.latitude;
    this.long = this.geolocationService.coordinates.coords.longitude;
  }

  markerDragEnd($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.long = $event.coords.lng;
  }
}
