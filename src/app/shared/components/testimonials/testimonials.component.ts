import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { DataService } from '../../../services/data.service';

export interface TestimonialView {
  id: number;
  rate: number;
  content: string;
  reviewer_name: string;
  initial: string;
  dateLabel: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  private readonly dataService = inject(DataService);

  /** Optional link for “See all reviews on Google”. */
  @Input() googleReviewsUrl = '#';

  readonly starIndexes = [1, 2, 3, 4, 5] as const;

  reviews: TestimonialView[] = [];
  averageRating = 0;
  loading = true;
  loadError = false;

  constructor() {
    this.dataService
      .getreviews()
      .pipe(
        takeUntilDestroyed(),
        catchError(() => {
          this.loadError = true;
          return of(null);
        })
      )
      .subscribe((res) => {
        this.loading = false;
        console.log('res', res);
        const raw = this.extractReviewList(res.data);
        this.reviews = raw.map((r, index) => this.normalizeReview(r, index));
        this.averageRating = this.computeAverage(this.reviews);
        console.log('reviews', this.reviews);
      });
  }

  private extractReviewList(res: unknown): any[] {
    if (!res || typeof res !== 'object') {
      return [];
    }
    const data = (res as { data?: unknown }).data;
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(res)) {
      return res as any[];
    }
    return [];
  }

  private normalizeReview(raw: any, fallbackIndex: number): TestimonialView {
    const name =
      (typeof raw?.reviewer_name === 'string' && raw.reviewer_name) ||
      (typeof raw?.author_name === 'string' && raw.author_name) ||
      (typeof raw?.name === 'string' && raw.name) ||
      'Traveler';
    const rate = Number(raw?.rate ?? raw?.rating ?? 5) || 0;
    const content =
      (typeof raw?.content === 'string' && raw.content) ||
      (typeof raw?.comment === 'string' && raw.comment) ||
      '';
    const id = typeof raw?.id === 'number' ? raw.id : fallbackIndex;
    const trimmed = name.trim();
    const initial = trimmed ? trimmed.charAt(0).toUpperCase() : '?';
    const dateLabel = this.formatReviewDate(raw?.created_at ?? raw?.date);

    return { id, rate, content, reviewer_name: name, initial, dateLabel };
  }

  private formatReviewDate(value: unknown): string {
    if (value == null || value === '') {
      return '';
    }
    const d = new Date(value as string);
    if (Number.isNaN(d.getTime())) {
      return typeof value === 'string' ? value : '';
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(d);
  }

  private computeAverage(list: TestimonialView[]): number {
    if (!list.length) {
      return 0;
    }
    const sum = list.reduce((acc, r) => acc + (Number.isFinite(r.rate) ? r.rate : 0), 0);
    return sum / list.length;
  }

  displayedReviews(): TestimonialView[] {
    return this.reviews.slice(0, 6);
  }
}
