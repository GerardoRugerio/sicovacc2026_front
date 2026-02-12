import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';


@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  public usuario = computed(() => this.authService.user())
  public nombre = computed(() => this.authService.nombre());
  public rol = computed(() => this.authService.rol());

  public open = signal<boolean>(true);

  openNav = ():void => {
    const sideNav = document.getElementById('sidenav');
    const mainContent = document.getElementById('main');

    if(!this.open()) {
      mainContent!.style.paddingLeft = '240px';
      sideNav?.classList.remove('closed');
      mainContent?.classList.remove('shifted');
    } else {
      mainContent!.style.paddingLeft = '0px';
      sideNav?.classList.add('closed');
      mainContent?.classList.add('shifted');
    }
    this.open.set(!this.open());
  }
}
