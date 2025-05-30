import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CookieBannerComponent {
  cookiesAccepted = false;

  ngOnInit(): void {
    const accepted = localStorage.getItem('cookiesAccepted');
    this.cookiesAccepted = accepted === 'true' || accepted === 'false';
  }

  acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.cookiesAccepted = true;
  }

  refuseCookies(): void {
    localStorage.setItem('cookiesAccepted', 'false');
    this.cookiesAccepted = true;
  }
}
