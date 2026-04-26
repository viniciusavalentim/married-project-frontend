import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { CountdownComponent } from '../components/countdown/countdown';
import {
  lucideLayoutGrid,
  lucideUtensils,
  lucideBedDouble,
  lucideBath,
  lucideSofa,
  lucideSparkles,
  lucideGift,
  lucideTarget,
  lucideUsers,
  lucideWallet,
} from '@ng-icons/lucide';
import { GiftCardComponent } from '../components/gift-card/gift-card';
import {
  ReserveDialogComponent,
  ReserveFormData,
} from '../components/reserve-dialog/reserve-dialog';
import { GiftService } from '../features/gifts/services/gift.service';
import { GiftItem } from '../features/gifts/models/gift-item.interface';
import { toast } from 'ngx-sonner';

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
export class HomeComponent implements OnInit {
  private giftService = inject(GiftService);

  gifts = signal<any>([]);
  isSelected = signal<number>(0);
  showReserved = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  searchText = signal<string>('');
  selectedGift = signal<GiftItem | null>(null);
  isLoading = signal<boolean>(false);
  isLoadingGifts = signal<boolean>(false);
  isReservedSuccess = signal<boolean>(false);

  filters = [
    { id: 0, name: 'Todos', icon: 'lucideLayoutGrid' },
    { id: 1, name: 'Cozinha', icon: 'lucideUtensils' },
    { id: 2, name: 'Quarto', icon: 'lucideBedDouble' },
    { id: 3, name: 'Banheiro', icon: 'lucideBath' },
    { id: 4, name: 'Sala', icon: 'lucideSofa' },
    { id: 5, name: 'Decoração', icon: 'lucideSparkles' },
  ];

  ngOnInit(): void {
    this.loadGifts();
  }

  loadGifts(): void {
    this.isLoadingGifts.set(true);
    this.giftService.getGifts().subscribe({
      next: (data) => {
        this.gifts.set(data.giftItems);
        this.isLoadingGifts.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar os presentes na API:', error);
        this.isLoadingGifts.set(false);
      },
    });
  }

  public filteredGifts = computed(() => {
    const allGifts = this.gifts();
    const showingReserved = this.showReserved();
    const currentCategory = this.isSelected();
    const search = this.searchText().toLowerCase().trim();

    let result = showingReserved ? allGifts.filter((gift: any) => gift.status === 1) : allGifts;

    if (currentCategory !== 0) {
      result = result.filter((gift: any) => gift.category === currentCategory);
    }

    if (search) {
      result = result.filter(
        (gift: any) =>
          gift.name.toLowerCase().includes(search) ||
          gift.description?.toLowerCase().includes(search),
      );
    }

    return result;
  });

  public handleChangeFilter(id: number) {
    this.isSelected.set(id);
  }

  public toggleReserved() {
    this.showReserved.update((v) => !v);
  }

  openModal(gift: GiftItem) {
    this.selectedGift.set(gift);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.isReservedSuccess.set(false);
    setTimeout(() => this.selectedGift.set(null), 300);
    document.body.style.overflow = 'auto';
  }

  confirmReservation(reserve: ReserveFormData) {
    const currentGift = this.selectedGift();
    const giftId = currentGift?.id;

    if (!giftId) {
      toast.error('Presente não selecionado ou sem ID válido.');
      return;
    }

    this.isLoading.set(true);

    this.giftService
      .reservedGift({
        giftItemId: giftId,
        guestName: reserve.name,
        guestPhone: reserve.phone,
      })
      .subscribe({
        next: (data) => {
          this.gifts.set(data.giftItems);
          this.isLoading.set(false);
          this.loadGifts();
          toast.success('Presente reservado com sucesso!');
          this.isReservedSuccess.set(true);
        },
        error: (error) => {
          console.error(':', error);
          toast.error('Erro ao reservar o presente!');
          this.isLoading.set(false);
        },
      });
  }

  public onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }
}
