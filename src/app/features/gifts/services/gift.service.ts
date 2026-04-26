import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetGiftItems } from '../models/gift-item.interface';
import { CreateGiftRequest, EditGiftRequest } from '../models/create-gift.request';
import { environment } from '../../../core/environment/environment';
import { ReservedGiftRequest } from '../models/reserved-gift.request';

@Injectable({
  providedIn: 'root',
})
export class GiftService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/GiftItem`;

  getGifts(): Observable<GetGiftItems> {
    return this.http.get<GetGiftItems>(this.baseUrl);
  }

  reservedGift(request: ReservedGiftRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservedBy`, request);
  }

  removeReservedGift(giftId: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservedBy/remove`, giftId);
  }

  createGift(request: CreateGiftRequest): Observable<any> {
    return this.http.post(this.baseUrl, request);
  }

  editGift(request: EditGiftRequest): Observable<any> {
    return this.http.put(this.baseUrl, request);
  }
}
