import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Emits every time the global loader (spinner) is shown. */
@Injectable({ providedIn: 'root' })
export class SpinnerEventsService {
  private readonly shown = new Subject<void>();
  readonly onShown = this.shown.asObservable();

  notifyShown(): void {
    this.shown.next();
  }
}
