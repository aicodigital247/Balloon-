/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Trophy, Home, Users, Wallet, User as UserIcon, ArrowUpRight, ArrowDownLeft, 
  Shield, CheckCircle, Bell, RefreshCw, Play, Radio, Send, Copy, Clock, Check
} from "lucide-react";
import { Tenant, User, Tournament, Team, LedgerEntry, Notification } from '../types';

interface PhoneSimulatorProps {
  currentTenant: Tenant;
  currentUser: User;
  tournaments: Tournament[];
  teams: Team[];
  ledger: LedgerEntry[];
  notifications: Notification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDeposit: (amount: number, description: string) => void;
  onWithdraw: (amount: number) => void;
  onRegisterTournament: (id: string, entryFee: number) => void;
  onPlayTournament: (id: string) => void;
  onAddTeam: (name: string) => void;
  commentaryLogs: Record<string, string>;
  isGeneratingCommentary: boolean;
}

export default function PhoneSimulator({
  currentTenant,
  currentUser,
  tournaments,
  teams,
  ledger,
  notifications,
  activeTab,
  setActiveTab,
  onDeposit,
  onWithdraw,
  onRegisterTournament,
  onPlayTournament,
  onAddTeam,
  commentaryLogs,
  isGeneratingCommentary
}: PhoneSimulatorProps) {
  // Local state for UI components
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showInitDataAlert, setShowInitDataAlert] = useState(false);

  // Telegram App simulated initData payload
  const simulatedInitData = `query_id=AAH6ZasDAAAAAMplqwNSfW36&user=%7B%22id%22%3A${currentUser.id}%2C%22first_name%22%3A%22${currentUser.username}%22%2C%22username%22%3A%22${currentUser.username}%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&auth_date=1718956550&hash=8b512c3bd39fca88921cf81c6ee38dbd486241a8df9e7d9b4b9b6df65ad16bd0`;

  // Filter items matching the current tenant boundaries
  const tenantTournaments = tournaments.filter(t => t.tenantId === currentTenant.id);
  const tenantTeams = teams.filter(t => t.tenantId === currentTenant.id);

  // Math for immutable ledger balances
  const creditSum = ledger.filter(l => l.type === 'credit').reduce((sum, entry) => sum + entry.amount, 0);
  const debitSum = ledger.filter(l => l.type === 'debit').reduce((sum, entry) => sum + entry.amount, 0);
  const calculatedBalance = creditSum - debitSum;

  const handleCopyInitData = () => {
    navigator.clipboard.writeText(simulatedInitData);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const executeDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (!amountNum || amountNum <= 0) return;
    onDeposit(amountNum, `Monnify Instant Transfer Deposit`);
    setDepositAmount('');
    setShowDepositModal(false);
  };

  const executeWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum <= 0) return;
    if (amountNum > calculatedBalance) {
      alert("Ledger Error: Insufficient funds in computed ledger balance!");
      return;
    }
    onWithdraw(amountNum);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    onAddTeam(newTeamName.trim());
    setNewTeamName('');
    setShowCreateTeamModal(false);
  };

  return (
    <div className="relative mx-auto max-w-sm rounded-[40px] border-[8px] border-elegant-border bg-black p-2 shadow-2xl ring-1 ring-elegant-border-muted">
      {/* Ear Speaker & Front Camera bar */}
      <div className="absolute top-4 left-1/2 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-elegant-border flex items-center justify-center">
        <div className="h-1 w-10 rounded-full bg-elegant-border-muted"></div>
        <div className="ml-2 h-2.5 w-2.5 rounded-full bg-black border border-elegant-border"></div>
      </div>

      {/* Actual Telegram Webview Window Container */}
      <div className="flex h-[640px] flex-col overflow-hidden rounded-[32px] bg-elegant-bg text-white font-sans relative">
        
        {/* Telegram Micro Top Banner Navigation Header */}
        <div className="bg-[#0f0f12]/95 border-b border-elegant-border px-4 pt-6 pb-2.5 flex items-center justify-between text-xs z-10 sticky top-0 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-elegant-accent animate-pulse"></span>
            <span className="font-mono text-elegant-text-gray font-semibold tracking-wider text-[10px]">TG_WEBAPP:CONNECT</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-elegant-surface px-2 py-0.5 rounded text-[10px] text-[#8e8e93] border border-elegant-border font-medium">v2.4</span>
            <span className="font-semibold text-slate-300 font-mono">BATTLEARENA</span>
          </div>
        </div>

        {/* Dynamic Tenant Info Indicator */}
        <div className="bg-elegant-surface border-b border-elegant-border px-3 py-1.5 flex items-center justify-between text-slate-300">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#00ff88] font-bold flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#00ff88]" /> Regional Tenant Gate
          </span>
          <span className="text-xs font-semibold flex items-center bg-[#0f0f12] text-[#8e8e93] px-2 py-0.5 rounded border border-elegant-border">
            {currentTenant.flag} {currentTenant.name} ({currentTenant.currency})
          </span>
        </div>

        {/* Scrollable SPA Page Content Segment */}
        <div className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
          
          {/* SCREEN 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Profile Card Summary & Balance display */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-elegant-surface to-[#0f0f12] p-4 border border-elegant-border">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-tr from-[#00ff88]/10 to-[#0088ff]/10 blur-xl"></div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currentUser.avatarUrl}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1">
                        @{currentUser.username}
                        <CheckCircle className="w-3.5 h-3.5 fill-elegant-accent text-black" />
                      </h4>
                      <p className="text-[10px] text-elegant-text-gray font-mono">ID: {currentUser.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-elegant-bg text-[#8e8e93] px-2 py-0.5 rounded-full border border-elegant-border font-mono">
                    Referral Count: {ledger.filter(l => l.description.includes('Referrals')).length}
                  </span>
                </div>

                {/* Fintech SUM computed balance display */}
                <div className="mt-2">
                  <span className="text-[10px] uppercase tracking-wider text-elegant-text-gray font-mono font-bold">Computed Ledger Balance</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-display text-white font-mono tracking-tight">
                      {currentTenant.currencySymbol}{calculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-elegant-text-gray font-mono uppercase">{currentTenant.currency}</span>
                  </div>
                  <div className="mt-1 flex items-center space-x-1.5 text-[9px] text-[#555] font-mono">
                    <span className="text-elegant-accent/85">Credits: {creditSum}</span>
                    <span>|</span>
                    <span className="text-red-400">Debits: {debitSum}</span>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowDepositModal(true)}
                    className="flex items-center justify-center space-x-1.5 rounded-xl bg-elegant-accent py-2 text-xs font-bold text-black transition hover:bg-elegant-accent/90 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Instant Credit</span>
                  </button>
                  <button 
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex items-center justify-center space-x-1.5 rounded-xl bg-elegant-surface py-2 text-xs font-bold text-white border border-elegant-border hover:bg-elegant-border cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Debit Out</span>
                  </button>
                </div>
              </div>

              {/* Bot verification & Deep Linking tool */}
              <div className="bg-elegant-surface rounded-xl p-3 border border-elegant-border text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-elegant-text-gray">Telegram initData WebApp Security</span>
                  <button 
                    onClick={() => setShowInitDataAlert(!showInitDataAlert)}
                    className="text-elegant-accent underline text-[10px] font-semibold font-mono"
                  >
                    Details
                  </button>
                </div>
                <p className="text-elegant-text-gray text-[11px] leading-relaxed mb-3">
                  BattleArena v2 secures transactions by validating custom cryptographic WebApp query signatures server-side.
                </p>
                {showInitDataAlert && (
                  <div className="bg-black p-2 rounded mb-3 border border-elegant-border font-mono text-[9px] text-slate-500 overflow-x-auto select-all max-h-24">
                    {simulatedInitData}
                  </div>
                )}
                <button
                  onClick={handleCopyInitData}
                  className="w-full bg-[#0f0f12] hover:bg-elegant-surface text-slate-300 py-1 rounded text-[11px] font-mono flex items-center justify-center gap-1.5 border border-elegant-border cursor-pointer"
                >
                  {isCopied ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Security payload copied' : 'Copy initData verification block'}</span>
                </button>
              </div>

              {/* Upcoming Highlights Banner card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-elegant-surface to-[#0f0f12] border border-elegant-border p-4">
                <div className="absolute inset-0 bg-elegant-accent/5 rounded-2xl blur-xl"></div>
                <span className="relative z-10 text-[9px] bg-elegant-accent/10 text-elegant-accent border border-elegant-accent/30 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold">STAKES CAMPAIGN</span>
                <h3 className="relative z-10 font-display font-semibold text-sm tracking-wide mt-2">Win G-Wagon Esports Custom Champion Badge</h3>
                <p className="relative z-10 text-[11px] text-elegant-text-gray mt-1">First-line registrations for PUBG and Free Fire automatically qualify for the Regional leaderboard prize.</p>
              </div>

              {/* Referral details */}
              <div className="bg-elegant-surface rounded-xl p-3 border border-elegant-border text-xs">
                <span className="text-[9px] font-mono text-elegant-text-gray uppercase tracking-widest block mb-1">Affiliate referral system</span>
                <div className="flex justify-between items-center bg-black p-2 rounded border border-elegant-border">
                  <span className="font-mono text-[#8e8e93] font-bold">{currentUser.referralCode}</span>
                  <span className="text-[#00ff88] font-semibold font-mono text-[10px]">+5% Cash Matches Entry Credit</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: TOURNAMENTS */}
          {activeTab === 'tournaments' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-sm flex items-center gap-1 text-slate-200">
                  <Trophy className="w-4 h-4 text-elegant-accent" /> Active Regional Cups
                </h3>
                <span className="text-[10px] text-elegant-text-gray font-mono">{tenantTournaments.length} Matches</span>
              </div>

              {tenantTournaments.length === 0 ? (
                <div className="text-center py-8 bg-elegant-surface rounded-xl border border-elegant-border text-elegant-text-gray text-xs">
                  No matches configured for this regional tenant yet. Toggle the admin panel database controls inside developer console to add new games!
                </div>
              ) : (
                <div className="space-y-3">
                  {tenantTournaments.map(tour => {
                    const isRegistered = ledger.some(l => l.reference === `REG-${tour.id}`);
                    return (
                      <div key={tour.id} className="bg-elegant-surface rounded-xl border border-elegant-border p-3 hover:border-elegant-border-muted transition relative">
                        {/* Game tag */}
                        <div className="flex justify-between items-center text-[10px] mb-2">
                          <span className="bg-black px-2 py-0.5 rounded border border-elegant-border font-semibold font-mono text-elegant-text-gray uppercase">
                            {tour.gameName}
                          </span>
                          <span className="text-elegant-text-gray flex items-center gap-1 font-mono text-[9px]">
                            <Clock className="w-3 h-3 text-elegant-accent" /> {tour.scheduledTime}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-semibold text-xs text-white pb-0.5">{tour.title}</h4>
                        <p className="text-[10px] text-elegant-text-gray mt-1 line-clamp-2 leading-relaxed font-sans">{tour.description}</p>

                        {/* Stated progress */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] bg-black p-2 rounded border border-elegant-border">
                          <div>
                            <span className="text-elegant-text-gray block uppercase text-[8px] tracking-wider font-semibold">Entry Stake</span>
                            <span className="font-bold text-white font-mono">
                              {currentTenant.currencySymbol}{tour.entryFee.toLocaleString('en-US')}
                            </span>
                          </div>
                          <div>
                            <span className="text-elegant-text-gray block uppercase text-[8px] tracking-wider font-semibold">Regional Prize</span>
                            <span className="font-bold text-elegant-accent font-mono">
                              {currentTenant.currencySymbol}{tour.prizePool.toLocaleString('en-US')}
                            </span>
                          </div>
                        </div>

                        {/* Interactive match action hooks */}
                        <div className="mt-3 pt-2 border-t border-elegant-border flex items-center justify-between">
                          <span className="text-[10px] text-elegant-text-gray font-mono">
                            Slots: <span className="text-white font-bold">{tour.currentParticipants}</span> / {tour.maxParticipants}
                          </span>

                          {/* Render dynamic state buttons */}
                          {tour.status === 'completed' ? (
                            <span className="text-[10px] bg-elegant-accent/10 text-elegant-accent border border-elegant-accent/20 px-2.5 py-0.5 rounded font-bold uppercase font-mono">
                              Claimed: {tour.winnerPlayerName}
                            </span>
                          ) : isRegistered ? (
                            <div className="flex items-center gap-1.5">
                              {tour.status === 'room_released' ? (
                                <div className="space-y-1 text-right">
                                  <span className="text-[9px] block text-elegant-accent font-bold animate-pulse font-mono flex items-center justify-end gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-elegant-accent"></span> ROOM ACTIVE
                                  </span>
                                  <div className="bg-black px-2 py-0.5 rounded border border-elegant-border font-mono text-[9px] text-[#8e8e93]">
                                    Code: {tour.roomCode}
                                  </div>
                                </div>
                              ) : tour.status === 'playing' ? (
                                <span className="text-[9px] bg-[#0088ff]/15 text-[#0088ff] border border-[#0088ff]/30 px-2 py-0.5 rounded font-mono font-bold animate-pulse uppercase flex items-center gap-1">
                                  <Radio className="w-2.5 h-2.5" /> LIVE PLAY
                                </span>
                              ) : (
                                <span className="text-[10px] text-elegant-text-gray font-mono font-bold">Registered (Waiting)</span>
                              )}

                              {tour.status !== 'playing' && (
                                <button
                                  onClick={() => onPlayTournament(tour.id)}
                                  disabled={isGeneratingCommentary}
                                  className="bg-elegant-accent hover:bg-elegant-accent/80 text-black font-semibold px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-black text-black" />
                                  <span>{isGeneratingCommentary ? '...' : 'Play'}</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                if (calculatedBalance < tour.entryFee) {
                                  alert(`Ledger Error: Insufficient funds mapping entry rate. Please credit ${currentTenant.currencySymbol}${tour.entryFee - calculatedBalance} first.`);
                                  return;
                                }
                                onRegisterTournament(tour.id, tour.entryFee);
                              }}
                              className="bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-semibold px-3 py-1 rounded-md text-[10px] font-mono border border-elegant-accent cursor-pointer"
                            >
                              Register Match
                            </button>
                          )}
                        </div>

                        {/* Interactive Commentary Drawer if active */}
                        {commentaryLogs[tour.id] && (
                          <div className="mt-3 bg-black p-2.5 rounded-lg border border-elegant-border text-[10px] font-mono leading-relaxed text-elegant-accent">
                            <div className="text-[9px] text-elegant-text-gray uppercase font-mono tracking-wider border-b border-elegant-border pb-1 mb-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-elegant-accent animate-ping"></span> Live Commentary Logs
                            </div>
                            <div className="space-y-1 select-text">
                              {commentaryLogs[tour.id].split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SCREEN 3: TEAMS */}
          {activeTab === 'teams' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-sm flex items-center gap-1 text-slate-200">
                  <span className="text-[#0088ff]">✦</span> Regional Clans & Squads
                </h3>
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="bg-[#0088ff] hover:bg-[#0088ff]/80 text-[#0f0f12] font-semibold px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase cursor-pointer"
                >
                  Create Clan
                </button>
              </div>

              {tenantTeams.length === 0 ? (
                <div className="text-center py-8 bg-elegant-surface rounded-xl border border-elegant-border text-elegant-text-gray text-xs">
                  No Clans created inside this tenant database yet. Click "Create Clan" above to register a squad!
                </div>
              ) : (
                <div className="space-y-3">
                  {tenantTeams.map(team => (
                    <div key={team.id} className="bg-elegant-surface rounded-xl border border-elegant-border p-3 flex items-start space-x-3">
                      <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center border border-elegant-border text-xl shadow-inner">
                        {team.logoUrl}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-xs text-white truncate">{team.name}</h4>
                          <span className="text-[9px] bg-black px-1.5 py-0.5 rounded border border-elegant-border font-mono text-elegant-text-gray">
                            Leader: Gladiator
                          </span>
                        </div>
                        <p className="text-[10px] text-elegant-text-gray mt-1">
                          Members: <span className="font-mono text-slate-300 font-semibold">{team.memberNames.join(', ')}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN 4: WALLET / LEDGER */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Regional Electronic Card */}
              <div className="bg-gradient-to-br from-elegant-border to-[#0f0f12] rounded-2xl border border-elegant-border-muted p-4 relative shadow-md">
                <div className="absolute top-2 right-4 text-xs font-mono font-bold text-elegant-border-muted uppercase tracking-widest">
                  BattleArena Security
                </div>
                
                <span className="text-[9px] font-mono text-elegant-accent uppercase tracking-wider block bg-elegant-accent/10 w-fit px-2 py-0.5 rounded border border-elegant-accent/20">
                  {currentTenant.flag} LEDGER PROTOCOL ENABLED
                </span>

                <div className="mt-4">
                  <span className="text-[9px] text-[#8e8e93] uppercase font-mono block">Computed Available Cash</span>
                  <div className="text-2xl font-bold font-display text-white">
                    {currentTenant.currencySymbol}{calculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-elegant-border flex justify-between items-center text-[10px] font-mono">
                  <div>
                    <span className="text-elegant-text-gray text-[8px] uppercase block">Assigned Account No</span>
                    <span className="text-white font-bold block">BA-{currentUser.id}-LEDG</span>
                  </div>
                  <div className="text-right">
                    <span className="text-elegant-text-gray text-[8px] uppercase block">Regional Issuer</span>
                    <span className="text-white font-bold block truncate max-w-28">{currentTenant.country}</span>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger Entries */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#8e8e93] block font-bold tracking-wider">Immutable Transactions Ledger Logs</span>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {ledger.map(entry => (
                    <div key={entry.id} className="bg-elegant-surface rounded-lg p-2.5 border border-elegant-border flex items-center justify-between text-[11px] leading-tight">
                      <div className="flex items-start space-x-2">
                        <div className={`p-1 rounded ${entry.type === 'credit' ? 'bg-[#00ff88]/10 text-elegant-accent border border-elegant-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {entry.type === 'credit' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs text-white font-semibold block truncate max-w-[180px]">{entry.description}</span>
                          <span className="text-[8px] text-[#555] font-mono block uppercase">Ref: {entry.reference}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`font-bold font-mono text-xs block ${entry.type === 'credit' ? 'text-elegant-accent' : 'text-white'}`}>
                          {entry.type === 'credit' ? '+' : '-'}{currentTenant.currencySymbol}{entry.amount.toLocaleString()}
                        </span>
                        <span className="text-[8px] text-elegant-text-gray font-mono block">
                          {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {ledger.length === 0 && (
                    <div className="text-center py-6 text-slate-600 font-mono text-[10px]">Empty Ledger Database</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Account Card Profile */}
              <div className="bg-elegant-surface rounded-xl border border-elegant-border p-4 flex items-center space-x-4">
                <div className="h-16 w-16 bg-black rounded-2xl flex items-center justify-center text-3xl border border-elegant-border shadow-md">
                  {currentUser.avatarUrl}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white flex items-center gap-1">
                    @{currentUser.username}
                    <CheckCircle className="w-3.5 h-3.5 fill-elegant-accent text-black" />
                  </h4>
                  <p className="text-[10px] text-elegant-text-gray font-mono mt-0.5">Secure ID: BA-{currentUser.id}</p>
                  <p className="text-[10px] text-[#555] mt-1 font-sans">SaaS Node: {currentTenant.id}</p>
                </div>
              </div>

              {/* Bot communication history panel */}
              <div className="bg-elegant-surface rounded-xl p-3 border border-elegant-border text-xs">
                <span className="text-[9px] font-mono text-[#8e8e93] uppercase tracking-widest block mb-1.5 font-bold">Simulated Telegram Bot Service</span>
                <p className="text-elegant-text-gray text-[11px] leading-relaxed mb-3">
                  This bot receives secure notifications for room keys, deposits, and winnings dispatched directly from the SaaS core.
                </p>
                
                {/* Bot notify logs */}
                <div className="bg-black rounded border border-elegant-border h-28 overflow-y-auto p-2 space-y-2">
                  {notifications.filter(n => n.tenantId === currentTenant.id).map(notif => (
                    <div key={notif.id} className="text-[10px] bg-elegant-surface p-1.5 rounded border border-elegant-border text-slate-300 font-mono flex items-start space-x-1">
                      <span className="text-[9px] text-elegant-accent mt-0.5">🤖</span>
                      <div className="flex-1">
                        <span className="text-[8px] text-elegant-text-gray block uppercase font-bold">{notif.type} log</span>
                        <p className="text-[10.5px] leading-tight text-white mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                  {notifications.filter(n => n.tenantId === currentTenant.id).length === 0 && (
                    <div className="text-center py-6 text-slate-600 text-[10px] font-mono">No bot notifications logged yet</div>
                  )}
                </div>
              </div>

              {/* Security Badging info */}
              <div className="bg-gradient-to-r from-elegant-surface to-black rounded-xl p-3 border border-elegant-border flex items-start space-x-2.5">
                <Shield className="w-5 h-5 text-elegant-accent flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h5 className="text-[11px] font-bold text-elegant-accent uppercase tracking-wider font-mono">Fintech Protection Active</h5>
                  <p className="text-[10px] text-elegant-text-gray leading-normal mt-0.5">
                    This browser workspace enforces atomic MySQL transactions, strict single-point routing controls, and live SHA-256 validation. No client-side database writes permitted.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Nav bar overlay - bottom navigation */}
        <nav className="absolute bottom-0 inset-x-0 bg-[#0f0f12] border-t border-elegant-border flex justify-around py-3 text-elegant-text-gray z-10 sticky backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'home' ? 'text-elegant-accent font-bold' : 'hover:text-white'}`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] mt-1 uppercase font-mono tracking-wider">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('tournaments')}
            className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'tournaments' ? 'text-elegant-accent font-bold' : 'hover:text-white'}`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[9px] mt-1 uppercase font-mono tracking-wider">Arena</span>
          </button>
          <button 
            onClick={() => setActiveTab('teams')}
            className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'teams' ? 'text-elegant-accent font-bold' : 'hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[9px] mt-1 uppercase font-mono tracking-wider">Teams</span>
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'wallet' ? 'text-elegant-accent font-bold' : 'hover:text-white'}`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[9px] mt-1 uppercase font-mono tracking-wider">Ledger</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-elegant-accent font-bold' : 'hover:text-white'}`}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-[9px] mt-1 uppercase font-mono tracking-wider">Profile</span>
          </button>
        </nav>
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. Monnify/Deposit Modal */}
      {showDepositModal && (
        <div className="absolute inset-x-2 top-24 z-30 bg-elegant-surface rounded-2xl border border-elegant-border p-4 shadow-2xl animate-scaleUp">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-display font-bold text-xs text-white uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-elegant-accent" /> Monnify Invoice Issuer
            </h5>
            <button 
              onClick={() => setShowDepositModal(false)}
              className="text-slate-500 hover:text-slate-300 font-mono text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <form onSubmit={executeDeposit} className="space-y-3">
            <div>
              <label className="text-[9px] uppercase font-mono text-elegant-text-gray block mb-1">Regional Payment Gateway</label>
              <select className="w-full bg-black border border-elegant-border rounded px-2.5 py-1.5 text-xs text-slate-250 focus:outline-none focus:border-elegant-border-muted font-mono">
                {currentTenant.depositMethods.map((m, idx) => (
                  <option key={idx} value={m} className="bg-elegant-surface">{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] uppercase font-mono text-elegant-text-gray block mb-1">Enter Credit Amount ({currentTenant.currency})</label>
              <div className="relative font-mono">
                <span className="absolute left-2.5 top-1.5 text-xs font-mono text-elegant-text-gray font-bold">{currentTenant.currencySymbol}</span>
                <input
                  type="number"
                  required
                  placeholder={currentTenant.entryFeeMultiplier * 5 + ""}
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full bg-black border border-elegant-border rounded pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-elegant-accent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-elegant-accent hover:bg-elegant-accent/90 text-black font-bold text-xs py-2 rounded-lg font-mono uppercase tracking-wider cursor-pointer"
            >
              Initiate Ledger Credit
            </button>
          </form>
        </div>
      )}

      {/* 2. Withdraw Modal */}
      {showWithdrawModal && (
        <div className="absolute inset-x-2 top-24 z-30 bg-elegant-surface rounded-2xl border border-elegant-border p-4 shadow-2xl animate-scaleUp">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-display font-bold text-xs text-white uppercase tracking-widest flex items-center gap-1">
              <ArrowDownLeft className="w-4 h-4 text-red-400" /> Payout System Dispatcher
            </h5>
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="text-slate-500 hover:text-slate-300 font-mono text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <form onSubmit={executeWithdraw} className="space-y-3">
            <div>
              <label className="text-[9px] uppercase font-mono text-elegant-text-gray block mb-1">Select Beneficiary Account</label>
              <select className="w-full bg-black border border-elegant-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none font-mono">
                <option value="saved">Master Telegram Acc: {currentUser.telegramId || 'TG-User'}</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] uppercase font-mono text-elegant-text-gray block mb-1">Amount to Debit ({currentTenant.currency})</label>
              <div className="relative font-mono">
                <span className="absolute left-2.5 top-1.5 text-xs font-mono text-elegant-text-gray font-bold">{currentTenant.currencySymbol}</span>
                <input
                  type="number"
                  required
                  placeholder={currentTenant.entryFeeMultiplier + ""}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="w-full bg-black border border-elegant-border rounded pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-red-650 hover:bg-red-550 text-white font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              Execute Debit Output
            </button>
          </form>
        </div>
      )}

      {/* 3. Create Team Modal */}
      {showCreateTeamModal && (
        <div className="absolute inset-x-2 top-24 z-30 bg-elegant-surface rounded-2xl border border-elegant-border p-4 shadow-2xl animate-scaleUp">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-display font-semibold text-xs text-white uppercase tracking-widest">
              Register New Clan
            </h5>
            <button 
              onClick={() => setShowCreateTeamModal(false)}
              className="text-slate-500 hover:text-slate-300 font-mono text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleCreateTeam} className="space-y-3">
            <div>
              <label className="text-[9px] uppercase font-mono text-elegant-text-gray block mb-1">SaaS Clan Name</label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="Naija Cyber-Phantoms"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="w-full bg-black border border-elegant-border rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#0088ff] font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0088ff] hover:bg-[#0088ff]/80 text-[#0a0a0c] font-bold text-xs py-2.5 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              Commit Clan Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
