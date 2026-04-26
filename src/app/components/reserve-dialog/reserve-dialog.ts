import { Component, inject, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideGift, lucideX } from '@ng-icons/lucide';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ReserveFormData {
  name: string;
  phone: string;
}

@Component({
  selector: 'app-reserve-dialog',
  imports: [DecimalPipe, NgIconComponent, ReactiveFormsModule],
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
  isSaveLoading = input.required<boolean>();
  isReservedSuccess = input.required<boolean>();

  close = output<void>();
  confirm = output<ReserveFormData>();

  private fb = inject(FormBuilder);

  reserveForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
  });

  public onCloseClick() {
    this.close.emit();
  }

  public onConfirmClick() {
    if (this.reserveForm.valid) {
      this.confirm.emit(this.reserveForm.getRawValue());
    } else {
      this.reserveForm.markAllAsTouched();
    }
  }
}
