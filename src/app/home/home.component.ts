import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { Suite } from '../module/module-suite/models/suite';
import { SuiteService } from '../module/module-suite/suite.service';
import { ReservationService } from '../module/module-reservation/module-reservation.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import {Meta, Title} from '@angular/platform-browser';
import {BookingCheckService} from '../module/module-suite/models/booking-check.service';
import {forkJoin} from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Swiper } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { SuiteDetailDialogComponent } from '../suite-detail-dialog/suite-detail-dialog.component';
import { ReservationSuccessDialogComponent } from '../reservation-success-dialog/reservation-success-dialog.component';
import { ReservationFailureDialogComponent } from '../reservation-failure-dialog/reservation-failure-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { register } from 'swiper/element/bundle';

declare var bootstrap: any;

// Enregistrer les éléments Swiper
register();

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SuiteDetailDialogComponent,
    UserDialogComponent,
    ReservationSuccessDialogComponent,
    ReservationFailureDialogComponent,
    MatIconModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  suites: Suite[] = [];
  startDate!: Date | null;
  endDate!: Date | null;
  selectedSuiteDescription: string = '';
  numberOfGuests!: number | null;
  availabilityMessage: string = '';
  isChecking: boolean = false;
  today = new Date();
  @ViewChild('myVideo', { static: false }) myVideo!: ElementRef<HTMLVideoElement>;
  photosGrouped: Array<Array<{thumb: string, large: string, alt: string}>> = [];
  currentPhoto = '';
  currentAlt = '';
  @ViewChild('photoModal') photoModalRef!: ElementRef;
  modalInstance: any;
  photos = [
    { thumb: 'assets/images/photo1.jpg', large: 'assets/images/photo1.jpg', alt: 'photo1'},
    { thumb: 'assets/images/photo2.jpg', large: 'assets/images/photo2.jpg', alt: 'Photo 2' },
    { thumb: 'assets/images/photo3.jpg', large: 'assets/images/photo3.jpg', alt: 'Photo 3' },
    { thumb: 'assets/images/photo4.jpg', large: 'assets/images/photo4.jpg', alt: 'Photo 4' },
    { thumb: 'assets/images/photo5.jpg', large: 'assets/images/photo5.jpg', alt: 'Photo 5' },
    { thumb: 'assets/images/photo6.jpg', large: 'assets/images/photo6.jpg', alt: 'Photo 6' },
    { thumb: 'assets/images/photo7.jpg', large: 'assets/images/photo7.jpg', alt: 'photo7'},
    { thumb: 'assets/images/photo8.jpg', large: 'assets/images/photo8.jpg', alt: 'Photo 8' },
    { thumb: 'assets/images/photo9.jpg', large: 'assets/images/photo9.jpg', alt: 'Photo 9' },
    { thumb: 'assets/images/photo10.jpg', large: 'assets/images/photo10.jpg', alt: 'Photo 10' },
    { thumb: 'assets/images/photo12.jpg', large: 'assets/images/photo12.jpg', alt: 'Photo 12' },
    { thumb: 'assets/images/photo14.jpg', large: 'assets/images/photo14.jpg', alt: 'Photo 14' },
  ];
  private swiper: Swiper | undefined;

  constructor(
    private suiteService: SuiteService,
    private reservationService: ReservationService,
    private BookingCheckService: BookingCheckService,
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { this.today.setHours(0, 0, 0, 0);}

  minEndDate(): Date | null {
    if (!this.startDate) return null;

    const date = new Date(this.startDate);
    date.setDate(date.getDate() + 1);
    return date;
  }

  isEndDateInvalid(): boolean {
    if (!this.startDate || !this.endDate) return false;
    const start = new Date(this.startDate).setHours(0, 0, 0, 0);
    const end = new Date(this.endDate).setHours(0, 0, 0, 0);
    return end <= start;
  }

  ngOnInit(): void {
    this.title.setTitle('Titre de la page SEO | Mon site');
    this.meta.addTags([
      { name: 'description', content: 'Description SEO optimisée de votre page.' },
      { name: 'keywords', content: 'angular, seo, spring, projet' },
      { name: 'robots', content: 'index, follow' }
    ]);
    const groupSize = 6;
    this.photosGrouped = [];
    for (let i = 0; i < this.photos.length; i += groupSize) {
      this.photosGrouped.push(this.photos.slice(i, i + groupSize));
    }
    this.suiteService.getSuites().subscribe((data: Suite[]) => {
      this.suites = data;
    });
    setTimeout(() => {
      const video = this.myVideo?.nativeElement;
      if (!video) return;

      video.muted = true;
      video.playsInline = true;


      video.addEventListener('canplay', () => {
        video.play().catch(err => {
          console.warn('Erreur lecture automatique :', err);
        });
      });


      video.load();
    }, 300);
  }

  openPhotoModal(photoUrl: string, altText: string) {
    this.currentPhoto = photoUrl;
    this.currentAlt = altText;
    console.log('Photo URL:', this.currentPhoto);
    console.log('Alt text:', this.currentAlt);

    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.photoModalRef.nativeElement); }
      this.modalInstance.show();
  }

  calculateTotalPrice(startDate: Date, endDate: Date, suitePrice: number): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diff = (endDate.getTime() - startDate.getTime()) / oneDay;
    const nights = Math.max(1, Math.round(diff));
    const basePrice = nights * suitePrice;
    const vatPercentage = 10;
    const vatAmount = basePrice * (vatPercentage / 100);
    const cityTax = 120.00; // Example city tax
    return basePrice + vatAmount + cityTax;
  }

  checkAvailability(): void {
    if (
      !this.startDate ||
      !this.endDate ||
      !this.selectedSuiteDescription ||
      !this.numberOfGuests ||
      this.numberOfGuests <= 0
    ) {
      this.availabilityMessage = '❗ Veuillez remplir tous les champs correctement.';
      return;
    }
    this.isChecking = true;

    // Format dates to YYYY-MM-DD without timezone conversion
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDateStr = formatDate(this.startDate);
    const endDateStr = formatDate(this.endDate);
    const children = 0;
    const rooms = 1;
    const adults = this.numberOfGuests;

    const booking$ = this.BookingCheckService.getAvailableRoomNames(startDateStr, endDateStr, adults, children, rooms);
    const localDB$ = this.reservationService.checkAvailability(
      this.selectedSuiteDescription,
      startDateStr,
      endDateStr,
      this.numberOfGuests
    );

    forkJoin([booking$, localDB$]).subscribe({
      next: ([availableSuiteNames, localAvailable]) => {
        const normalize = (str: string) =>
          str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const bookingAvailable = availableSuiteNames.some(name =>
          normalize(name) === normalize(this.selectedSuiteDescription)
        );
        this.isChecking = false;
        if (bookingAvailable && localAvailable) {
          this.availabilityMessage = '';
          
          // Find the selected suite to get its price
          const selectedSuite = this.suites.find(s => s.description === this.selectedSuiteDescription);
          if (!selectedSuite) {
            this.availabilityMessage = "Erreur: Suite non trouvée";
            return;
          }

          // Calculate total price
          const totalPrice = this.calculateTotalPrice(
            this.startDate!,
            this.endDate!,
            selectedSuite.pricePerNight
          );

          // Navigate to reservation page with all necessary details
          this.router.navigate(['/reservation'], {
            queryParams: {
              suiteDescription: this.selectedSuiteDescription,
              startDate: startDateStr,
              endDate: endDateStr,
              numberOfGuests: this.numberOfGuests,
              suitePrice: selectedSuite.pricePerNight,
              totalPrice: totalPrice,
              vatPercentage: 10,
              cityTax: 120.00
            }
          });
        }
        else {
          this.availabilityMessage = "Cette suite n'est pas disponible pour les dates choisies.";
        }
      },
      error: () => {
        this.isChecking = false;
        this.availabilityMessage = 'Une erreur est survenue lors de la vérification.';
      }
    });
  }

  openSuiteDetailDialog(suite: Suite): void {
    console.log('openSuiteDetailDialog called with suite:', suite);
    this.dialog.open(SuiteDetailDialogComponent, {
      data: {
        image: suite.imageUrls && suite.imageUrls.length > 0 ? suite.imageUrls[0] : '',
        name: suite.description,
        equipments: suite.equipments ? suite.equipments.map((item: string) => item.trim()) : []
      }
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper() {
    this.swiper = new Swiper('.product-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      },
      effect: 'slide',
      speed: 800,
      grabCursor: true,
      keyboard: {
        enabled: true,
      },
      mousewheel: {
        forceToAxis: true,
      }
    });
  }
}
