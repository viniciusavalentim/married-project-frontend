export enum GiftStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PURCHASED = 'purchased',
}

export enum RoomCategory {
  KITCHEN = 'Cozinha',
  BATHROOM = 'Banheiro',
  BEDROOM = 'Quarto',
  LIVING_ROOM = 'Sala',
  DECOR = 'Decoração',
}

export interface GiftReservedBy {
  guestName: string;
  guestPhone: string;
  reservedAt: Date;
}

export interface GiftItem {
  id: string;
  name: string;
  description?: string;
  externalLink?: string;
  status: GiftStatus;
  images: string;
  price: number;
  category: RoomCategory;
  reservedBy?: GiftReservedBy;
  createdAt: string;
  updatedAt: string;
}
