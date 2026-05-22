export type PickupStatus = 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  walletBalance: number;
  referralCode: string;
  referralsInvited: number;
  referralsJoined: number;
  referralsPointsEarned: number;
  savedCards: SavedCard[];
}

export interface SavedCard {
  id: string;
  brand: 'Visa' | 'Mastercard';
  last4: string;
  expiry: string;
}

export interface Pickup {
  id: string;
  userId: string;
  address: string;
  landmark?: string;
  phone: string;
  date: string;
  timeSlot: string;
  bagsCount: number;
  wasteTypes: string[];
  price: number;
  status: PickupStatus;
  paymentMethod: string;
  pointsAwarded: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  userId: string;
  pickupId: string;
  category: string;
  description: string;
  imageUrl?: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  resolution?: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'funding' | 'pickup_payment' | 'refund' | 'reward';
  amount: number;
  description: string;
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
}

export interface RewardVoucher {
  id: string;
  title: string;
  network: string;
  pointsCost: number;
  type: 'airtime' | 'data';
  description: string;
  value: string;
  bgColor: string;
}

export interface RecyclingPoint {
  id: string;
  name: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  materials: string[];
}
