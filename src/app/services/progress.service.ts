import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  
  private isLoading_: boolean[] = [false];

  private cnt = 0

  appCompenentWasHere = false

  isLoading() {
    this.cnt += 1
    return this.isLoading_[0]
  } 

  startLoading() {

    //console.log("appCompenentWasHere??????", this.appCompenentWasHere);
    
    this.isLoading_ = [true]
    //console.log("startLoading", this.isLoading_, this.cnt);
  }

  stopLoading() {
    this.isLoading_ = [false]
    //console.log("stopLoading", this.isLoading_, this.cnt);
  }
}
