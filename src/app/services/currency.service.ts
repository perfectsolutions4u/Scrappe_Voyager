import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

const CACHE_MS = 60 * 60 * 1000; // 1 hour

export interface CurrencyOption {
  name: string;
  symbol: string;
  value: string;
}

export interface DisplayPrice {
  value: number;
  symbol: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly nameToCode: Record<string, string> = {
    Dollar: 'USD',
    Euro: 'EUR',
    'Sterling Pound': 'GBP',
  };

  private readonly codeToSymbol: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  /** Fallback when API fails: how many units of target currency per 1 USD (e.g. 1 USD = 0.92 EUR) */
  private readonly fallbackRates: Record<string, number> = {
    EUR: 0.92,
    GBP: 0.79,
  };

  private ratesCache: { rates: Record<string, number>; ts: number } | null = null;

  private currencyName = signal<string>('Dollar');
  currentCurrencyCode = computed(() => this.nameToCode[this.currencyName()] ?? 'USD');
  currentSymbol = computed(() => this.codeToSymbol[this.currentCurrencyCode()] ?? '$');
  rates = signal<Record<string, number> | null>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('currency');
      if (saved && this.nameToCode[saved] !== undefined) {
        this.currencyName.set(saved);
      }
      this.loadRates().subscribe();
    }
  }

  setCurrency(currencyName: string): void {
    if (this.nameToCode[currencyName] !== undefined) {
      this.currencyName.set(currencyName);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currency', currencyName);
        if (!this.rates()) {
          this.loadRates().subscribe();
        }
      }
    }
  }

  getCurrencyName(): string {
    return this.currencyName();
  }

  /**
   * Loads exchange rates. API may return EGP-based rates; we normalize to "per 1 USD"
   * so that amountInUSD * rate gives the value in the target currency.
   */
  loadRates(): Observable<Record<string, number>> {
    if (this.ratesCache && Date.now() - this.ratesCache.ts < CACHE_MS) {
      this.rates.set(this.ratesCache.rates);
      return of(this.ratesCache.rates);
    }
    const url = environment.exchangeRatesUrl;
    return this.http.get<{ result: string; rates: Record<string, number> }>(url).pipe(
      tap((res) => {
        if (res?.result === 'success' && res.rates) {
          const base = res.rates;
          const usdPerBase = base['USD'];
          const ratesFromUSD: Record<string, number> = {};
          if (usdPerBase != null && usdPerBase > 0) {
            for (const [code, perBase] of Object.entries(base)) {
              if (code !== 'USD') ratesFromUSD[code] = perBase / usdPerBase;
            }
          }
          this.ratesCache = { rates: ratesFromUSD, ts: Date.now() };
          this.rates.set(ratesFromUSD);
        }
      }),
      map((res) => {
        if (res?.result !== 'success' || !res.rates?.['USD']) return {};
        const base = res.rates;
        const usdPerBase = base['USD'];
        const ratesFromUSD: Record<string, number> = {};
        for (const [code, perBase] of Object.entries(base)) {
          if (code !== 'USD') ratesFromUSD[code] = perBase / usdPerBase;
        }
        return ratesFromUSD;
      }),
      catchError(() => {
        this.rates.set(null);
        return of({});
      })
    );
  }

  /**
   * Converts a price from USD (API base currency) to the selected display currency.
   * When Dollar is selected, returns the amount as-is from the API.
   */
  getConvertedPrice(amountInUSD: number | undefined | null): DisplayPrice {
    const amount = amountInUSD ?? 0;
    const code = this.currentCurrencyCode();
    const symbol = this.currentSymbol();

    if (code === 'USD') {
      return { value: amount, symbol, code };
    }

    const r = this.rates();
    const rate = r?.[code] ?? this.fallbackRates[code];
    if (rate == null) {
      return { value: amount, symbol, code };
    }
    const value = Math.round(amount * rate * 100) / 100;
    return { value, symbol, code };
  }
}
