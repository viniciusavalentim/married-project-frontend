export interface CreateGiftRequest {
  name: string;
  description: string;
  externalLink: string;
  images: string;
  price: number;
  category: number;
}

export interface ReservedBy {
  id: string;
  guestName: string;
  guestPhone: string;
  reservedAt: string;
}

export interface EditGiftRequest {
  giftItem: GiftRequest;
}

export interface GiftRequest {
  id: string;
  name: string;
  description: string;
  externalLink: string;
  images: string;
  price: number;
  category: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  reservedBy: ReservedBy | null;
}
