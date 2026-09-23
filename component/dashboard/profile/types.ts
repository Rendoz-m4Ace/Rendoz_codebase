// ─── Shared profile types ────────────────────────────────────────────────────
// Keep this file minimal so any colleague working on owner-profile features
// can safely add fields without touching modal components.

export type AccountType = 'individual' | 'business';

export interface ProfileData {
  accountType: AccountType;
  phone: string;
  whatsappNotifications: boolean;
  photoUrl: string | null;
  /** city + state string shown publicly, e.g. "Ikeja, Lagos State" */
  locationLabel: string;
  locationState: string;
  locationCity: string;
  locationStreet: string;
  locationInstructions: string;
  ninVerified: boolean;
  payoutBankName: string;
  payoutAccountNumber: string;
  payoutAccountName: string;
  /** Business fields – only relevant when accountType === 'business' */
  businessName: string;
  businessRegNumber: string;
  businessAddress: string;
}

export const defaultProfileData: ProfileData = {
  accountType: 'individual',
  phone: '',
  whatsappNotifications: true,
  photoUrl: null,
  locationLabel: '',
  locationState: '',
  locationCity: '',
  locationStreet: '',
  locationInstructions: '',
  ninVerified: false,
  payoutBankName: '',
  payoutAccountNumber: '',
  payoutAccountName: '',
  businessName: '',
  businessRegNumber: '',
  businessAddress: '',
};
