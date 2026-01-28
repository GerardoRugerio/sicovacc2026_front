import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeightService {

  private scrollable:boolean = document.querySelector('section')!.scrollHeight > 970;
}
