import { Component, computed, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CountdownComponent } from '../components/countdown/countdown';
import {
  lucideLayoutGrid,
  lucideUtensils,
  lucideBedDouble,
  lucideBath,
  lucideSofa,
  lucideSparkles,
} from '@ng-icons/lucide';
import { GiftCardComponent } from '../components/gift-card/gift-card';
import { mockGifts } from '../../utils/mock/gift';
import { DecimalPipe } from '@angular/common';
import { GiftItem } from '../../utils/types/gift';
import { ReserveDialogComponent } from '../components/reserve-dialog/reserve-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIconComponent, CountdownComponent, GiftCardComponent, ReserveDialogComponent],
  providers: [
    provideIcons({
      lucideLayoutGrid,
      lucideUtensils,
      lucideBedDouble,
      lucideBath,
      lucideSofa,
      lucideSparkles,
    }),
  ],
  templateUrl: './home.html',
})
export class HomeComponent {
  isSelected = 1;
  gifts = mockGifts;
  filters = [
    { id: 1, name: 'Todos', icon: 'lucideLayoutGrid' },
    { id: 2, name: 'Cozinha', icon: 'lucideUtensils' },
    { id: 3, name: 'Quarto', icon: 'lucideBedDouble' },
    { id: 4, name: 'Banheiro', icon: 'lucideBath' },
    { id: 5, name: 'Sala', icon: 'lucideSofa' },
    { id: 6, name: 'Decoração', icon: 'lucideSparkles' },
  ];
  isModalOpen = signal(false);
  selectedGift = signal<GiftItem | null>(null);
  showReserved = signal(false);

  openModal(gift: GiftItem) {
    this.selectedGift.set(gift);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    setTimeout(() => this.selectedGift.set(null), 300);
    document.body.style.overflow = 'auto';
  }

  confirmReservation() {
    alert(`Reserva do item ${this.selectedGift()?.name} confirmada!`);
    this.closeModal();
  }

  public filteredGifts = computed(() => {
    // const activeFilter = this.isSelected;
    const isShowingReserved = this.showReserved();

    // Começamos com a lista completa
    let result = this.gifts;

    // Filtro 1: Categoria
    // if (activeFilter !== 1) {
    //   result = result.filter((gift) => gift.categoryId === activeFilter);
    // }

    // Filtro 2: Reservados (Se o toggle estiver desligado, removemos os reservados)
    if (!isShowingReserved) {
      result = result.filter((gift) => !gift.reservedBy);
    }

    return result;
  });

  public handleChangeFilter(id: number) {
    this.isSelected = id;
  }

  public toggleReserved() {
    this.showReserved.update((valorAtual) => !valorAtual);
  }
}
