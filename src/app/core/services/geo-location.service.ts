import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class GeoLocationService {

  coordinates: any;

  constructor() { }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        resp => {
          resolve({ long: resp.coords.longitude, lat: resp.coords.latitude });
        },
        err => {
          reject(err);
        }, {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
      });
    });

  }
}
