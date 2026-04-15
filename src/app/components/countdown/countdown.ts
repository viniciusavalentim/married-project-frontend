import { Component, effect, input, OnDestroy, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './countdown.html',
})
export class CountdownComponent implements OnInit, OnDestroy {
  targetDateStr = input.required<string>();

  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  isFinished = signal(false);

  private targetDate!: Date;
  private intervalId: any;

  constructor() {
    effect(() => {
      this.targetDate = this.parseDateString(this.targetDateStr());
      this.updateCountdown();
    });
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private parseDateString(dateStr: string): Date {
    if (!dateStr) return new Date();

    const parts = dateStr.split(' ');
    const datePart = parts[0];
    const timePart = parts[1] || '00:00:00';

    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');

    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours || '0'),
      parseInt(minutes || '0'),
      parseInt(seconds || '0'),
    );
  }

  private updateCountdown(): void {
    if (!this.targetDate) return;

    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance <= 0) {
      this.isFinished.set(true);
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return;
    }

    this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
  }
}
