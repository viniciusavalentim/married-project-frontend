import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGift, lucideExternalLink } from '@ng-icons/lucide';
import { GiftItem } from '../../features/gifts/models/gift-item.interface';

@Component({
  selector: 'app-gift-card',
  standalone: true,
  imports: [DecimalPipe, NgIconComponent],
  providers: [provideIcons({ lucideGift, lucideExternalLink })],
  templateUrl: './gift-card.html',
})
export class GiftCardComponent {
  @Input({ required: true }) giftItem!: GiftItem;
  @Output() reserve = new EventEmitter<GiftItem>();

  get categoryName(): string {
    switch (this.giftItem.category) {
      case 1:
        return 'Cozinha';
      case 2:
        return 'Quarto';
      case 3:
        return 'Banheiro';
      case 4:
        return 'Sala';
      case 5:
        return 'Decoração';
      default:
        return 'Outros';
    }
  }

  get statusName(): string {
    return this.giftItem.status === 0 ? 'Disponível' : 'Reservado';
  }

  onReserveClick() {
    this.reserve.emit(this.giftItem);
  }
}
