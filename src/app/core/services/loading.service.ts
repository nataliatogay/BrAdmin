import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  constructor() {}

  private isLoading;

  public get IsLoading(): boolean {
    return this.isLoading;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
}
