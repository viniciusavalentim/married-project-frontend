import { Component, input, output } from '@angular/core';
import { GiftItem } from '../../../utils/types/gift';
import { DecimalPipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGift, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-reserve-dialog',
  imports: [DecimalPipe, NgIconComponent],
  providers: [
    provideIcons({
      lucideX,
      lucideGift,
    }),
  ],
  templateUrl: './reserve-dialog.html',
})
export class ReserveDialogComponent {
  gift = input.required<any>();

  close = output<void>();
  confirm = output<void>();

  public onCloseClick() {
    this.close.emit();
  }

  public onConfirmClick() {
    this.confirm.emit();
  }
}
