import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { GiftService } from '../features/gifts/services/gift.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideLayoutGrid,
  lucideUtensils,
  lucideBedDouble,
  lucideBath,
  lucideSofa,
  lucideSparkles,
  lucideFilter,
  lucideGift,
  lucideTarget,
  lucideUsers,
  lucideWallet,
  lucideSearch,
  lucideMoreHorizontal,
  lucideCalendar,
  lucideClock,
  lucideExternalLink,
  lucidePhone,
  lucideUser,
  lucidePalette,
  lucideEdit,
  lucideX,
  lucideAlertTriangle,
} from '@ng-icons/lucide';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { AddGiftDialogComponent } from '../components/add-gift-dialog/add-gift-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin',
  imports: [NgIconComponent, DecimalPipe, AddGiftDialogComponent, NgClass, CommonModule],
  providers: [
    provideIcons({
      lucideLayoutGrid,
      lucideUtensils,
      lucideBedDouble,
      lucideBath,
      lucideSofa,
      lucideSparkles,
      lucideFilter,
      lucideGift,
      lucideUsers,
      lucideWallet,
      lucideTarget,
      lucideSearch,
      lucideExternalLink,
      lucideUser,
      lucidePhone,
      lucideCalendar,
      lucideClock,
      lucideMoreHorizontal,
      lucidePalette,
      lucideEdit,
      lucideX,
      lucideAlertTriangle,
    }),
  ],
  templateUrl: './admin.html',
})
export class AdminComponent implements OnInit {
  private giftService = inject(GiftService);
  isLoadingGifts = signal<boolean>(false);
  gifts = signal<any>([]);
  giftItem = signal<any>(null);
  isAddModalOpen = signal<boolean>(false);

  statusFilter = signal<string>('all');
  categoryFilter = signal<string>('all');
  searchQuery = signal<string>('');

  isConfirmModalOpen = signal<boolean>(false);
  giftIdToRemove = signal<any>(null);

  openDropdownId = signal<string | number | null>(null);

  totalValueGifts = computed(() => {
    return this.gifts().reduce((value: number, gift: any) => value + gift.price, 0);
  });

  totalValueGiftsReserved = computed(() => {
    return this.gifts()
      .filter((gift: any) => gift.status === 1 && gift.reservedBy?.guestPhone !== '16997008655')
      .reduce((value: number, gift: any) => value + gift.price, 0);
  });

  totalValueGiftsSpent = computed(() => {
    return this.gifts()
      .filter((gift: any) => gift.status === 1 && gift.reservedBy?.guestPhone === '16997008655')
      .reduce((value: number, gift: any) => value + gift.price, 0);
  });

  totalProgress = computed(() => {
    const totalValue = this.totalValueGifts();
    const totalReserved = this.gifts()
      .filter((gift: any) => gift.status === 1)
      .reduce((value: number, gift: any) => value + gift.price, 0);

    return totalValue > 0 ? Math.round((totalReserved / totalValue) * 100) : 0;
  });

  toggleDropdown(itemId: string | number, event: Event) {
    event.stopPropagation();

    if (this.openDropdownId() === itemId) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(itemId);
    }
  }

  @HostListener('document:click')
  closeDropdown() {
    this.openDropdownId.set(null);
  }

  getStatusClasses(status: number): string {
    switch (status) {
      case 1:
        return 'text-amber-700 bg-amber-50 px-3 py-1 rounded-full';
      case 0:
        return 'text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full';
      default:
        return 'text-gray-500 bg-transparent px-3 py-1';
    }
  }

  ngOnInit(): void {
    this.loadGifts();
  }

  filteredGifts = computed(() => {
    const currentStatus = this.statusFilter();
    const currentCategory = this.categoryFilter();
    const currentSearch = this.searchQuery().toLowerCase().trim();
    const originalList = this.gifts();

    return originalList.filter((item: any) => {
      let matchStatus = true;
      if (currentStatus === 'reserved') {
        matchStatus = item.status === 1;
      } else if (currentStatus === 'available') {
        matchStatus = item.status === 0;
      } else if (currentStatus === 'gifted') {
        matchStatus = item.status === 2;
      }

      let matchCategory = true;
      if (currentCategory !== 'all') {
        const categoryName = this.getCategoryName(item.category).toLowerCase();
        const formattedCategory = categoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        matchCategory = formattedCategory === currentCategory;
      }

      let matchSearch = true;
      if (currentSearch) {
        matchSearch = item.name.toLowerCase().includes(currentSearch);
      }

      return matchStatus && matchCategory && matchSearch;
    });
  });

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery.set(inputElement.value);
  }

  setStatusFilter(status: string) {
    this.statusFilter.set(status);
  }

  setCategoryFilter(category: string) {
    this.categoryFilter.set(category);
  }

  getCategoryName(categoryId: number): string {
    switch (categoryId) {
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

  openConfirmModal(giftId: any) {
    this.giftIdToRemove.set(giftId);
    this.isConfirmModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeConfirmModal() {
    this.isConfirmModalOpen.set(false);
    this.giftIdToRemove.set(null);
    document.body.style.overflow = 'auto';
  }

  confirmRemove() {
    const giftId = this.giftIdToRemove();
    if (!giftId) return;

    const giftRequest = { giftId: giftId };

    this.giftService.removeReservedGift(giftRequest).subscribe({
      next: () => {
        this.loadGifts();
        this.openDropdownId.set(null);

        this.closeConfirmModal();

        toast.success('Reserva removida com sucesso');
      },
      error: (error) => {
        toast.error('Erro ao remover reserva do presente:', error);
        this.closeConfirmModal();
      },
    });
  }

  openAddModal(gift: any = null) {
    this.isAddModalOpen.set(true);
    this.giftItem = gift;
    document.body.style.overflow = 'hidden';
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  handleSaveGift(newGiftData: any) {
    if (newGiftData.isEdit) {
      this.giftService.editGift(newGiftData.data).subscribe({
        next: () => {
          this.loadGifts();
          this.closeAddModal();
          toast.success('Presente editado com sucesso');
        },
        error: (error) => {
          toast.error('Erro ao editar o presente:', error);
        },
      });
    } else {
      this.giftService.createGift(newGiftData.data).subscribe({
        next: () => {
          this.loadGifts();
          this.closeAddModal();
          toast.success('Presente adicionado com sucesso');
        },
        error: (error) => {
          toast.error('Erro ao salvar o presente:', error);
        },
      });
    }
  }
}
