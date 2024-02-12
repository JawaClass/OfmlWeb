import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveScrollPositionService {
  scrollY = -1
  scrollX = -1
}
