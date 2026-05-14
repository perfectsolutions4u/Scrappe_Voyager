import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-whatsapp-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-icon.component.html',
  styleUrl: './whatsapp-icon.component.scss',
})
export class WhatsappIconComponent implements OnInit {
  whatsappNumber: string = '';
  whatsappMessage: string = 'Hello! I would like to know more about your services.';
  phoneNumber: string = '';
  email: string = '';
  dropdownOpen = false;
  isCoarsePointer = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.isCoarsePointer =
      typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

    this.dataService.getSetting().subscribe((res) => {
      const whatsappNumber = res.data.find((item: any) => item.option_key === 'CONTACT_PHONE_NUMBER')?.option_value;
      this.whatsappNumber = whatsappNumber ? whatsappNumber[0] : '';
      const phoneNumber = res.data.find((item: any) => item.option_key === 'CONTACT_PHONE_NUMBER')?.option_value;
      this.phoneNumber = phoneNumber ? phoneNumber[0] : '';
      const email = res.data.find((item: any) => item.option_key === 'email_address')?.option_value;
      this.email = email ? email[0] : '';
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isCoarsePointer || !this.dropdownOpen) {
      return;
    }
    const el = event.target as HTMLElement;
    if (!el.closest('.contact-fab')) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    if (!this.isCoarsePointer) {
      return;
    }
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  onContactLinkClick(event: Event, value: string): void {
    if (!value?.trim()) {
      event.preventDefault();
    }
  }

  getWhatsAppUrl(): string {
    const digits = this.whatsappNumber.replace(/[^0-9]/g, '');
    if (!digits) {
      return '#';
    }
    const encodedMessage = encodeURIComponent(this.whatsappMessage);
    return `https://wa.me/${digits}?text=${encodedMessage}`;
  }

  getTelHref(): string {
    const raw = this.phoneNumber.replace(/[^\d+]/g, '');
    const normalized = raw.startsWith('+') ? '+' + raw.slice(1).replace(/\+/g, '') : raw.replace(/\+/g, '');
    return normalized ? `tel:${normalized}` : '#';
  }

  getMailtoHref(): string {
    if (!this.email?.trim()) {
      return '#';
    }
    const subject = encodeURIComponent('Inquiry from website');
    return `mailto:${this.email.trim()}?subject=${subject}`;
  }
}
