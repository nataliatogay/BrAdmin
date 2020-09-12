import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  constructor(
  ) {
    this.isLoading = false;
  }

  private isLoading;

  public get IsLoading(): boolean {
    return this.isLoading;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
}
