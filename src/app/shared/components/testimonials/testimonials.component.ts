import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { DataService } from '../../../services/data.service';

export interface TestimonialView {
  id: number;
  rate: number;
  content: string;
  shortContent: string;
  isLongContent: boolean;
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
export class TestimonialsComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() googleReviewsUrl = '#';

  readonly starIndexes = [1, 2, 3, 4, 5] as const;

  reviews: TestimonialView[] = [];
  visibleReviews: TestimonialView[] = [];
  averageRating = 0;
  loading = true;
  loadError = false;
  readonly contentPreviewLength = 150;
  private readonly expandedReviewIds = new Set<number>();

  ngOnInit(): void {
    this.dataService
      .getreviews()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.loadError = true;
          this.loading = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe((res) => {
        const raw = this.extractReviewList(res?.data);
        this.reviews = raw.map((r, index) => this.normalizeReview(r, index));
        this.visibleReviews = this.reviews.slice(0, 6);
        this.averageRating = this.computeAverage(this.reviews);
        this.loading = false;
        this.cdr.detectChanges();
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
    const normalizedContent = content.trim();
    const isLongContent = normalizedContent.length > this.contentPreviewLength;
    const shortContent = isLongContent
      ? `${normalizedContent.slice(0, this.contentPreviewLength).trimEnd()}...`
      : normalizedContent;
    const id = typeof raw?.id === 'number' ? raw.id : fallbackIndex;
    const trimmed = name.trim();
    const initial = trimmed ? trimmed.charAt(0).toUpperCase() : '?';
    const dateLabel = this.formatReviewDate(raw?.created_at ?? raw?.date);

    return {
      id,
      rate,
      content: normalizedContent,
      shortContent,
      isLongContent,
      reviewer_name: name,
      initial,
      dateLabel,
    };
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

  isExpanded(reviewId: number): boolean {
    return this.expandedReviewIds.has(reviewId);
  }

  toggleExpanded(reviewId: number): void {
    if (this.expandedReviewIds.has(reviewId)) {
      this.expandedReviewIds.delete(reviewId);
      return;
    }
    this.expandedReviewIds.add(reviewId);
  }
}
