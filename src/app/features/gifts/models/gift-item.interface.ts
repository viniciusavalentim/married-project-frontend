export interface GiftItem {
  id: string;
  name: string;
  description: string;
  externalLink?: string;
  images: string;
  price: number;
  category: number;
  status: number;
  reservedBy: GiftReservedBy;
}

export interface GiftReservedBy {
  id: string;
  guestName: string;
  guestPhone: string;
  reservedAt: string;
}

export interface GetGiftItems {
  giftItems: GiftItem[];
}
