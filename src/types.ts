/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tenant {
  id: string; // e.g. "ba_nigeria", "ba_ghana", "ba_kenya", "ba_south_africa"
  name: string;
  country: string;
  currency: string; // e.g. "NGN", "GHS", "KES", "ZAR"
  currencySymbol: string; // e.g. "₦", "₵", "KSh", "R"
  flag: string; // Emoji
  entryFeeMultiplier: number; // For adjusting balance scales
  depositMethods: string[];
}

export interface User {
  id: number;
  username: string;
  telegramId?: string;
  telegramName?: string;
  avatarUrl: string;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  joinedTenantId: string;
}

export interface Wallet {
  id: string;
  userId: number;
  tenantId: string;
  accountNo: string;
}

export interface LedgerEntry {
  id: number;
  walletId: string;
  reference: string; // Unique transaction reference
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Team {
  id: string;
  tenantId: string;
  name: string;
  logoUrl: string;
  leaderId: number;
  memberNames: string[];
}

export interface Tournament {
  id: string;
  tenantId: string;
  title: string;
  gameName: string;
  entryFee: number;
  prizePool: number;
  currentParticipants: number;
  maxParticipants: number;
  status: 'upcoming' | 'registered' | 'room_released' | 'playing' | 'completed';
  roomCode?: string;
  winnerPlayerName?: string;
  description: string;
  scheduledTime: string;
}

export interface Notification {
  id: string;
  tenantId: string;
  userId: number;
  type: 'system' | 'match' | 'wallet' | 'referral';
  message: string;
  createdAt: string;
  isBotSent: boolean; // Wheter it triggers on the Telegram Bot Simulator Feed
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  earnings: number;
  wins: number;
  mvps: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  sqlQuery?: string;
}
