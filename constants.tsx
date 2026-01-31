
import { LGA, Team, Member } from './types';

export const INITIAL_LGAS: LGA[] = [
  { id: 'KT', name: 'KATSINA LGA' },
  { id: 'BAT', name: 'BATAGARAWA LGA' },
  { id: 'MAL', name: 'MALUMFASHI LGA' },
  { id: 'DAU', name: 'DAURA LGA' },
  { id: 'KAN', name: 'KANKIA LGA' },
  { id: 'MAS', name: 'MASHI LGA' },
];

// Preloaded Teams for KT and BAT as per request
export const INITIAL_TEAMS: Team[] = [
  { id: 'KT-T1', name: 'KT Team Alpha', lgaId: 'KT', leaderId: 'user-kt-1' },
  { id: 'KT-T2', name: 'KT Team Beta', lgaId: 'KT', leaderId: 'user-kt-2' },
  { id: 'BAT-T1', name: 'BAT Team Zenith', lgaId: 'BAT', leaderId: 'user-bat-1' },
  { id: 'MAL-T1', name: 'MAL Team One', lgaId: 'MAL', leaderId: 'user-mal-1' },
];

// Preloaded Members for KT and BAT
export const INITIAL_MEMBERS: Member[] = [
  { id: 'M1', name: 'Abubakar Sani', teamId: 'KT-T1' },
  { id: 'M2', name: 'Zainab Yusuf', teamId: 'KT-T1' },
  { id: 'M3', name: 'Ibrahim Musa', teamId: 'KT-T2' },
  { id: 'M4', name: 'Fatima Bala', teamId: 'KT-T2' },
  { id: 'M5', name: 'Umar Faruk', teamId: 'BAT-T1' },
  { id: 'M6', name: 'Aisha Bello', teamId: 'BAT-T1' },
];
