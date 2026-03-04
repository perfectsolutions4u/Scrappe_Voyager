import { Component, Inject, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappIconComponent } from './shared/components/whatsapp-icon/whatsapp-icon.component';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpinnerEventsService } from './services/spinner-events.service';
import { Subscription } from 'rxjs';

const TYPING_FULL_TEXT = 'scarabée voyageur';
const TYPING_DELAY_MS = 120;

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavComponent, FooterComponent, NgxSpinnerModule, WhatsappIconComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  protected readonly title = signal('scarabée voyageur');
  protected readonly typingText = signal('');
  protected readonly isBrowserValue: boolean;
  private typingIntervalId: ReturnType<typeof setInterval> | null = null;
  private spinnerSub?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private spinnerEvents: SpinnerEventsService
  ) {
    this.isBrowserValue = isPlatformBrowser(this.platformId);
  }

  protected isBrowser(): boolean {
    return this.isBrowserValue;
  }

  ngOnDestroy(): void {
    this.clearTypingInterval();
    this.spinnerSub?.unsubscribe();
  }

  private clearTypingInterval(): void {
    if (this.typingIntervalId != null) {
      clearInterval(this.typingIntervalId);
      this.typingIntervalId = null;
    }
  }

  private startTypingAnimation(): void {
    this.clearTypingInterval();
    this.typingText.set('');
    let index = 0;
    this.typingIntervalId = setInterval(() => {
      if (index >= TYPING_FULL_TEXT.length) {
        if (this.typingIntervalId != null) {
          clearInterval(this.typingIntervalId);
          this.typingIntervalId = null;
        }
        return;
      }
      this.typingText.set(TYPING_FULL_TEXT.slice(0, index + 1));
      index += 1;
    }, TYPING_DELAY_MS);
  }

  ngOnInit(): void {
    if (this.isBrowserValue) {
      this.startTypingAnimation();
      this.spinnerSub = this.spinnerEvents.onShown.subscribe(() => this.startTypingAnimation());
    }
    if (isPlatformBrowser(this.platformId)) {
      const langCode = localStorage.getItem('language') || 'en';

      // Apply lang and dir to <html>
      const htmlTag = document.documentElement;
      htmlTag.setAttribute('lang', langCode);
      htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR

      // Listen for language changes
      this.translate.onLangChange.subscribe((event) => {
        const currentLang = event.lang;
        htmlTag.setAttribute('lang', currentLang);
        htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR
      });
    } else {
      this.translate.use('en');
    }
  }
}
