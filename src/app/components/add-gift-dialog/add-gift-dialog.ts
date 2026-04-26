import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, output, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-add-gift-dialog',
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './add-gift-dialog.html',
})
export class AddGiftDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() addGift = new EventEmitter<any>();
  @Input({ required: false }) giftItem!: any;

  private fb = inject(FormBuilder);
  giftForm!: FormGroup;
  title: string = '';
  saveButton: string = '';

  categories = [
    { id: 1, name: 'Cozinha', icon: 'lucideUtensils' },
    { id: 2, name: 'Quarto', icon: 'lucideBedDouble' },
    { id: 3, name: 'Banheiro', icon: 'lucideBath' },
    { id: 4, name: 'Sala', icon: 'lucideSofa' },
    { id: 5, name: 'Decoração', icon: 'lucideSparkles' },
  ];

  ngOnInit(): void {
    this.title = this.giftItem ? 'Editar Item' : 'Adicionar Novo Item';
    this.saveButton = this.giftItem ? 'Salvar alterações' : 'Adicionar';

    this.giftForm = this.fb.group({
      name: [this.giftItem?.name || '', Validators.required],
      description: [this.giftItem?.description || ''],
      price: [this.giftItem?.price || null, [Validators.required, Validators.min(0)]],
      category: [this.giftItem?.category || 1, Validators.required],
      externalLink: [this.giftItem?.externalLink || ''],
      images: [this.giftItem?.images || ''],
      guestName: [this.giftItem?.reservedBy?.guestName || ''],
      guestPhone: [this.giftItem?.reservedBy?.guestPhone || ''],
    });
  }

  get selectedCategoryName(): string {
    const selectedId = this.giftForm.get('category')?.value;
    return this.categories.find((c) => c.id === selectedId)?.name || '';
  }

  setCategory(id: number) {
    this.giftForm.patchValue({ category: id });
  }

  onSubmit() {
    const { guestName, guestPhone, ...giftData } = this.giftForm.value;
    if (this.giftForm.valid) {
      let payloadToEmit;

      if (this.giftItem) {
        payloadToEmit = {
          giftItem: {
            ...this.giftItem,
            ...giftData,
            reservedBy: {
              ...(this.giftItem.reservedBy || {}),
              guestName: guestName,
              guestPhone: guestPhone,
            },
          },
        };
      } else {
        payloadToEmit = {
          ...giftData,
        };
      }

      const saveForm = {
        data: payloadToEmit,
        isEdit: !!this.giftItem,
      };

      this.addGift.emit(saveForm);
    } else {
      this.giftForm.markAllAsTouched();
    }
  }
}
