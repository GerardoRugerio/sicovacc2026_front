import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'shared-scrollbutton-top',
  template: `
    @if(isShow){
      <button id="btn_up" (click)="goToTop()"><i class="bi bi-arrow-up"></i></button>
    }
  `,
  styles: `
    button {
      width: 40px;
      height: 40px;
      transform: translate(20PX, -25px);
      text-align: center;
      color: white !important;
      font-weight: bold;
      border-radius: 50%;
      background-color: #32215C;
      border: #32215C solid 1px;
      position: fixed;
      bottom: -15px;
      right: 30px;
      transition: all .2s ease-in;
      box-shadow: 0px 9px 15px rgba(0,0,0,0.7);
      padding: 0px;
    }
    button:hover {
      background-color: #6A5ACD;
      border: #6A5ACD solid 2px;
    }
  `
})
export class ScrollTopComponent {
  public isShow:boolean = false;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if(scrollPosition > 150) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  goToTop() {
    let top = document.getElementById('top');
    if(top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
}
