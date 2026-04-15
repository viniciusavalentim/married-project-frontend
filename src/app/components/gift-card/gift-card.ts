import { Component, input, output } from '@angular/core';
import { GiftItem } from '../../../utils/types/gift';
import { DecimalPipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGift, lucideExternalLink } from '@ng-icons/lucide';

@Component({
  selector: 'app-gift-card',
  standalone: true,
  imports: [DecimalPipe, NgIconComponent],
  providers: [provideIcons({ lucideGift, lucideExternalLink })],
  templateUrl: './gift-card.html',
})
export class GiftCardComponent {
  giftItem = input.required<GiftItem>();

  reserve = output<any>();

  public onReserveClick() {
    this.reserve.emit(this.giftItem());
  }
}
