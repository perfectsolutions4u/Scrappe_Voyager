import { Injectable } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';

@Injectable({
  providedIn: 'root',
})
export class DatepickerService {
  /**
   * Local midnight of today — use as `[min]` on Material datepickers so past days are disabled.
   */
  static startOfTodayLocal(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Opens a date picker if it exists
   * @param datepicker - The MatDatepicker instance to open
   */
  openDatePicker(datepicker: MatDatepicker<Date> | null | undefined): void {
    if (datepicker) {
      datepicker.open();
    }
  }

  /**
   * Opens a date range picker if it exists
   * @param dateRangePicker - The MatDateRangePicker instance to open
   */
  openDateRangePicker(dateRangePicker: any | null | undefined): void {
    if (dateRangePicker && typeof dateRangePicker.open === 'function') {
      dateRangePicker.open();
    }
  }
}

