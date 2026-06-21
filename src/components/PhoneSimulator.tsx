/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Home, Users, Wallet, User as UserIcon, ArrowUpRight, ArrowDownLeft, 
  Shield, CheckCircle, Bell, RefreshCw, Play, Radio, Send, Copy, Clock, Check,
  Flame, Crown, ChevronRight, Plus, Search, Share2, LogOut, Settings, Terminal,
  Database, AlertTriangle, Key, Cpu, HelpCircle, FileCode, CheckSquare
} from "lucide-react";
import { Tenant, User, Tournament, Team, LedgerEntry, Notification, AuditLog } from '../types';
import { ARCHITECTURE_FILES } from '../data';

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
  // SaaS developer integrations we are bridging inside the phone viewport
  auditLogs: AuditLog[];
  onTriggerLedgerAdd: (type: 'credit' | 'debit', amount: number, description: string) => void;
  onRunCron: (scriptName: string) => void;
  onClearDatabase: () => void;
  onAdminCreateTournament: (title: string, game: string, entryFee: number, prize: number) => void;
  onAdminPayoutTournament: (tournamentId: string, winnerName: string) => void;
  onAdminReleaseRoom: (tournamentId: string) => void;
  isGeneratingTournamentAI: boolean;
  onGenerateAITournament: (game: string, prize: number) => void;
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
  isGeneratingCommentary,
  // Developer actions
  auditLogs,
  onTriggerLedgerAdd,
  onRunCron,
  onClearDatabase,
  onAdminCreateTournament,
  onAdminPayoutTournament,
  onAdminReleaseRoom,
  isGeneratingTournamentAI,
  onGenerateAITournament
}: PhoneSimulatorProps) {
  
  // Immersive Navigation steps
  // 'splash' ➔ 'auth' ➔ 'app'
  const [appLifecycle, setAppLifecycle] = useState<'splash' | 'auth' | 'app'>('splash');
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashLabel, setSplashLabel] = useState('Initializing telemetry...');
  
  // Auth states
  const [isConnectingTg, setIsConnectingTg] = useState(false);
  const [tgConnected, setTgConnected] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string[]>([]);
  const [activeVerificationStep, setActiveVerificationStep] = useState(0);

  // Sub-navigation inside app (for detail screens)
  // 'home' | 'arena_list' | 'arena_details' | 'wallet' | 'deposit' | 'withdraw' | 'teams' | 'leaderboard' | 'profile' | 'notifications'
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  // Skeleton Loader States for Dashboard and Tournaments
  const [isFetchingDashboard, setIsFetchingDashboard] = useState(false);
  const [isFetchingTournaments, setIsFetchingTournaments] = useState(false);
  
  // Local Form state inputs
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawBank, setWithdrawBank] = useState<string>('OPay Nigeria');
  const [withdrawAccount, setWithdrawAccount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [clanLogo, setClanLogo] = useState('💀');
  const [newClanName, setNewClanName] = useState('');
  const [showClanModal, setShowClanModal] = useState(false);
  const [depositSuccessToast, setDepositSuccessToast] = useState<string | null>(null);
  const [generalToast, setGeneralToast] = useState<string | null>(null);

  // virtual bank transfer mock timing system
  const [depositSimulating, setDepositSimulating] = useState(false);
  const [depositTimer, setDepositTimer] = useState<number | null>(null);
  const [depositSuccessRef, setDepositSuccessRef] = useState<string | null>(null);

  // withdraw payout status logs
  const [withdrawHistory, setWithdrawHistory] = useState<Array<{
    id: string;
    bank: string;
    account: string;
    amount: number;
    status: 'Pending' | 'Approved' | 'Paid';
    timestamp: string;
  }>>([]);

  // Developer node drawer state
  const [showDevDrawer, setShowDevDrawer] = useState(false);
  const [devTab, setDevTab] = useState<'cron' | 'database' | 'php_src' | 'ai_draft'>('cron');
  const [inspectedFile, setInspectedFile] = useState(ARCHITECTURE_FILES[0]);
  const [fileCopied, setFileCopied] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualDescription, setManualDescription] = useState('Custom manual ledger top-up');
  const [manualType, setManualType] = useState<'credit' | 'debit'>('credit');
  const [customGame, setCustomGame] = useState('Free Fire');
  const [customPrize, setCustomPrize] = useState('50000');

  // Leaderboard lists
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'global' | 'weekly' | 'monthly'>('global');

  // Telegram simulation handshake string keys
  const simulatedInitData = `query_id=AAH6ZasDAAAAAMplqwNSfW36&user=%7B%22id%22%3A${currentUser.id}%2C%22first_name%22%3A%22${currentUser.username}%22%2C%22username%22%3A%22${currentUser.username}%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%7D&auth_date=${Math.floor(Date.now() / 1000)}&hash=8b512c3bd39fca88921cf81c6ee38dbd486241a8df9e7d9b4b9b6df65ad16bd0`;

  // Filter items matching the current tenant boundaries
  const tenantTournaments = tournaments.filter(t => t.tenantId === currentTenant.id);
  const tenantTeams = teams.filter(t => t.tenantId === currentTenant.id);

  // Math for immutable ledger balances
  const creditSum = ledger.filter(l => l.type === 'credit').reduce((sum, entry) => sum + entry.amount, 0);
  const debitSum = ledger.filter(l => l.type === 'debit').reduce((sum, entry) => sum + entry.amount, 0);
  const calculatedBalance = creditSum - debitSum;

  // 1. Splash Screen countdown loader
  useEffect(() => {
    if (appLifecycle === 'splash') {
      const interval = setInterval(() => {
        setSplashProgress(prev => {
          const next = prev + 4;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setAppLifecycle('auth'), 400);
            return 100;
          }
          // Dynamic text based on loading progress
          if (next < 30) setSplashLabel('Initializing Secure Ledger API...');
          else if (next < 60) setSplashLabel('Resolving SaaS Regional Shards for ' + currentTenant.country + '...');
          else if (next < 85) setSplashLabel('Synchronizing Telegram WebApp HMAC Session keys...');
          else setSplashLabel('Entering BattleArena Gateway...');
          return next;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [appLifecycle, currentTenant]);

  const triggerToast = (msg: string) => {
    setGeneralToast(msg);
    setTimeout(() => setGeneralToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Copied ${label}!`);
  };

  // 2. Auth handshake verification sequencing
  const handleTgConnect = async () => {
    setIsConnectingTg(true);
    setVerificationFeedback([]);
    
    const steps = [
      "📡 Handshake request dispatched to Telegram Bot Core API...",
      "🔗 Fetching secure initData signature hash keys...",
      "🔑 Decoding query query_id & user metadata values...",
      "🛡️ Executing HMAC-SHA256 signature alignment check...",
      "✅ WebApp integrity authenticated successfully! HMAC validated against Bot Secret key."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setVerificationFeedback(prev => [...prev, steps[i]]);
      setActiveVerificationStep(i);
    }

    setTgConnected(true);
    setIsConnectingTg(false);
  };

  const handleEnterDashboard = () => {
    setAppLifecycle('app');
    setActiveTab('home');
  };

  // Trigger deposit process
  const handleStartDepositSim = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (!amountNum || amountNum <= 0) return;

    setDepositSimulating(true);
    const mockRef = `BA-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    setDepositSuccessRef(mockRef);

    // Simulate Nigerian virtual bank transfer ledger update after 3 seconds
    const timer = window.setTimeout(() => {
      onDeposit(amountNum, `Instant Virtual Bank Transfer via Monnify`);
      setDepositSimulating(false);
      setDepositAmount('');
      setDepositSuccessToast(`Credited: ₦${amountNum.toLocaleString()} matches stake ready!`);
      // auto hide toast
      setTimeout(() => setDepositSuccessToast(null), 3500);
      setActiveTab('wallet');
    }, 4500);

    setDepositTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (depositTimer) clearTimeout(depositTimer);
    };
  }, [depositTimer]);

  // Automate high-fidelity simulated API telemetry loading transitions
  useEffect(() => {
    if (appLifecycle === 'app') {
      if (activeTab === 'home') {
        setIsFetchingDashboard(true);
        const timer = setTimeout(() => {
          setIsFetchingDashboard(false);
        }, 1100);
        return () => clearTimeout(timer);
      } else if (activeTab === 'arena_list') {
        setIsFetchingTournaments(true);
        const timer = setTimeout(() => {
          setIsFetchingTournaments(false);
        }, 1100);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, currentTenant.id, appLifecycle]);

  const handleWithdrawPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum <= 0) return;
    if (amountNum > calculatedBalance) {
      alert("Ledger Error: Payout amount exceeds available computed ledger sum!");
      return;
    }

    onWithdraw(amountNum);
    const newPayout = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      bank: withdrawBank,
      account: withdrawAccount,
      amount: amountNum,
      status: 'Pending' as const,
      timestamp: new Date().toLocaleString()
    };

    setWithdrawHistory(prev => [newPayout, ...prev]);
    setWithdrawAmount('');
    setWithdrawAccount('');
    triggerToast(`Payout of ${currentTenant.currencySymbol}${amountNum.toLocaleString()} broadcasted!`);
    
    // Simulate approval and instant dispatch within 8 sands
    setTimeout(() => {
      setWithdrawHistory(curr => curr.map(item => {
        if (item.id === newPayout.id) {
          return { ...item, status: 'Approved' };
        }
        return item;
      }));
    }, 4000);

    setTimeout(() => {
      setWithdrawHistory(curr => curr.map(item => {
        if (item.id === newPayout.id) {
          return { ...item, status: 'Paid' };
        }
        return item;
      }));
    }, 8500);
  };

  const handleCreateClan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClanName.trim()) return;
    onAddTeam(newClanName.trim());
    setNewClanName('');
    setShowClanModal(false);
    triggerToast(`Registered Clan "${newClanName}"!`);
  };

  const handleCopyInspectedFile = () => {
    navigator.clipboard.writeText(inspectedFile.code);
    setFileCopied(true);
    setTimeout(() => setFileCopied(false), 2000);
    triggerToast(`Source code copied!`);
  };

  const handleLocalLedgerInject = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount);
    if (isNaN(amt) || amt <= 0) return;
    onTriggerLedgerAdd(manualType, amt, manualDescription);
    setManualAmount('');
    triggerToast(`Injected ledger transaction!`);
  };

  const handleLocalAiTournamentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prizeNum = parseFloat(customPrize) || 20000;
    onGenerateAITournament(customGame, prizeNum);
    triggerToast(`Prompting Gemini Agent...`);
  };

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId);

  // Leaderboard data lookup
  const globalLeaderboard = [
    { rank: 1, name: "NaijaPredator_FF", earnings: 340000, wins: 72, mvps: 54, clan: "Lagos Phantoms" },
    { rank: 2, name: "Gladiator22", earnings: calculatedBalance > 0 ? 180000 + calculatedBalance : 180000, wins: 41, mvps: 29, clan: "Lagos Phantoms" },
    { rank: 3, name: "YorubaEsports", earnings: 125000, wins: 28, mvps: 14, clan: "Naija Cyber-Wolves" },
    { rank: 4, name: "CalabarSniper", earnings: 85000, wins: 19, mvps: 11, clan: "Accra Black Stars" },
    { rank: 5, name: "LagosPhantom_Pro", earnings: 42000, wins: 11, mvps: 6, clan: "Lagos Phantoms" }
  ];

  return (
    <div className="w-full max-w-[420px] mx-auto rounded-[44px] border-[10px] border-slate-900 bg-[#020617] relative shadow-2xl overflow-hidden min-h-[640px] flex flex-col font-sans mb-8">
      
      {/* Phone Camera Notch bar / Dynamic Island Simulation */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-32 bg-slate-900 rounded-full z-40 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-950 border border-slate-800 ml-auto mr-4"></div>
      </div>

      {/* ─── lifecycle 1: SPLASH SCREEN ─── */}
      {appLifecycle === 'splash' && (
        <div className="absolute inset-0 bg-[#020617] flex flex-col justify-center items-center z-50 p-6 select-none animate-fadeIn">
          {/* Animated emblem logo with custom layout glows */}
          <div className="relative mb-8 mt-12">
            <div className="h-28 w-28 rounded-full border-4 border-dashed border-[#facc15] flex items-center justify-center animate-spin duration-1000 bg-slate-900/50 shadow-[0_0_25px_rgba(250,204,21,0.25)]"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-slate-900 to-slate-950 rounded-full flex items-center justify-center border-2 border-[#facc15]/30">
              <Flame className="w-12 h-12 text-[#facc15] fill-[#facc15]/20 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-white text-center">
            BattleArena
          </h2>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1 font-mono">
            Free Fire Tournament Gateway
          </p>

          <div className="w-full max-w-[240px] mt-24">
            <div className="flex justify-between items-baseline mb-1.5 font-mono text-[9px] text-slate-400">
              <span className="truncate max-w-[180px] font-semibold">{splashLabel}</span>
              <span className="font-bold text-[#facc15]">{splashProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900/70 border border-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-[#facc15] to-amber-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.6)] transition-all duration-75"
                style={{ width: `${splashProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-auto pb-4 text-[9px] font-mono text-slate-600 select-none">
            BATTLEARENA v2 // MULTI-TENANT SAAS NODE (ACTIVE)
          </div>
        </div>
      )}

      {/* ─── lifecycle 2: AUTH SCREEN (TELEGRAM HANDSHAKE) ─── */}
      {appLifecycle === 'auth' && (
        <div className="absolute inset-0 bg-[#020617] p-6 flex flex-col z-50 select-none justify-between animate-fadeIn">
          
          {/* Top aesthetic banner */}
          <div className="pt-8">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest font-bold">Secure TeleNode Connection</span>
            </div>
            <h2 className="text-[19px] font-bold font-display uppercase text-center text-white mt-1.5">Connect Secure Profile</h2>
          </div>

          {/* Visual Avatar Scanning Card */}
          <div className="my-auto bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl relative shadow-[0_0_15px_rgba(15,23,42,0.5)] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#facc15] shadow-[0_0_10px_#facc15] animate-bounce"></div>
            
            <div className="flex flex-col items-center py-4">
              <div className="relative mb-3">
                <div className="h-20 w-20 bg-slate-950 border border-[#1f2937] rounded-2xl flex items-center justify-center text-4xl shadow-inner relative z-10 overflow-hidden">
                  {currentUser.avatarUrl}
                </div>
                {tgConnected && (
                  <div className="absolute -bottom-1 -right-1 z-20 bg-emerald-500 rounded-full p-0.5 border-2 border-slate-900 shadow-md">
                    <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />
                  </div>
                )}
              </div>

              <h3 className="text-sm font-semibold tracking-wide text-white">
                @{currentUser.username}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {currentUser.telegramId}</p>

              {verificationFeedback.length > 0 && (
                <div className="w-full mt-4 bg-[#020617] rounded-xl border border-slate-800 p-2.5 font-mono text-[9.5px] text-zinc-400 leading-normal space-y-1 text-left max-h-[140px] overflow-y-auto">
                  {verificationFeedback.map((text, idx) => (
                    <div 
                      key={idx} 
                      className={`transition-all duration-300 ${idx === activeVerificationStep ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}`}
                    >
                      {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 pb-4">
            {!tgConnected ? (
              <button 
                onClick={handleTgConnect}
                disabled={isConnectingTg}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.15)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Cpu className={`w-4 h-4 ${isConnectingTg ? 'animate-spin' : ''}`} />
                <span>{isConnectingTg ? 'Validating WebApp Signature...' : 'Connect Telegram Account'}</span>
              </button>
            ) : (
              <button 
                onClick={handleEnterDashboard}
                className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(250,204,21,0.15)] cursor-pointer animate-pulse-slow"
              >
                <span>Continue as @{currentUser.username}</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
            
            <p className="text-[10px] text-zinc-500 text-center font-mono">
              Securing connection via HMAC Sha256 keys
            </p>
          </div>
        </div>
      )}

      {/* ─── lifecycle 3: ACTIVE APPLICATION FRAME ─── */}
      {appLifecycle === 'app' && (
        <div className="flex-1 flex flex-col h-full bg-[#020617] text-white relative">
          
          {/* Header Bar Area */}
          <div className="bg-[#0f172a] border-b border-[#1f2937] px-4 pt-7 pb-2.5 flex items-center justify-between text-xs sticky top-0 z-30 select-none">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span className="font-mono text-zinc-400 font-bold tracking-wider text-[10px]">TG_WEB_CONNECT:LIVE</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="bg-slate-950 px-2.5 py-0.5 rounded text-[10px] text-zinc-400 border border-slate-800 font-bold font-mono">
                {currentTenant.flag} NGA_NODE
              </span>
              <button 
                onClick={() => {
                  setAppLifecycle('auth');
                  setTgConnected(false);
                  setVerificationFeedback([]);
                }} 
                className="text-zinc-500 hover:text-white"
                title="Disconnect Gateway"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Regional Gate Banner */}
          <div className="bg-gradient-to-r from-[#030712] to-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-400">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" /> Local Ledger Gate
            </span>
            <span className="text-[10.5px] font-semibold text-slate-400 flex items-center font-mono py-0.5 px-2 bg-slate-950 rounded-full border border-slate-800/80">
              {currentTenant.name} ({currentTenant.currency})
            </span>
          </div>

          {/* Scrollable Single Page Area */}
          <div className="flex-1 overflow-y-auto pb-16 p-4">

            {/* A. TOAST ALERTS OVERLAY */}
            {depositSuccessToast && (
              <div className="absolute top-16 inset-x-4 z-40 bg-slate-950 border border-[#22c55e] p-3 rounded-2xl flex items-center space-x-3 shadow-[0_0_20px_rgba(34,197,94,0.2)] animate-scaleUp">
                <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-[#22c55e]/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Ledger Synchronized</span>
                  <p className="text-[10.5px] leading-tight text-white">{depositSuccessToast}</p>
                </div>
              </div>
            )}

            {generalToast && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#0f172a] border border-[#1f2937] px-4 py-2 rounded-full text-[11px] font-semibold text-[#facc15] font-mono shadow-2xl flex items-center gap-1.5 animate-scaleUp whitespace-nowrap">
                <Check className="w-3.5 h-3.5 text-[#00ff88]" />
                {generalToast}
              </div>
            )}

            {/* B. SCREEN 3: HOME DASHBOARD */}
            {activeTab === 'home' && (
              isFetchingDashboard ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Profile Widget Card Skeleton */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl relative overflow-hidden animate-pulse">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/50">
                      <div className="flex items-center space-x-2.5">
                        {/* Avatar Skeleton */}
                        <div className="h-10 w-10 bg-slate-800/60 rounded-xl"></div>
                        <div className="space-y-1.55">
                          {/* Username Skeleton */}
                          <div className="h-4 w-28 bg-slate-800/60 rounded-md"></div>
                          {/* User ID Skeleton */}
                          <div className="h-2.5 w-16 bg-slate-800/40 rounded-md"></div>
                        </div>
                      </div>
                      {/* Pro Badge Skeleton */}
                      <div className="h-5 w-24 bg-slate-800/50 rounded-full"></div>
                    </div>

                    {/* Computed Cash Skeleton */}
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-800/40 rounded-md"></div>
                      <div className="flex items-baseline space-x-1.5">
                        <div className="h-8 w-44 bg-slate-850 rounded-lg"></div>
                        <div className="h-4 w-8 bg-slate-800/40 rounded-md"></div>
                      </div>
                      <div className="flex items-center space-x-2.5 mt-2">
                        <div className="h-3 w-28 bg-slate-800/40 rounded-md"></div>
                        <span className="text-zinc-800 font-mono">|</span>
                        <div className="h-3 w-28 bg-slate-800/40 rounded-md"></div>
                      </div>
                    </div>

                    {/* Quick Actions Grid Skeleton */}
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center bg-slate-950/70 border border-slate-800/80 p-2 rounded-2xl">
                          <div className="h-8 w-8 bg-slate-850 rounded-xl mb-1"></div>
                          <div className="h-2 w-10 bg-slate-800/40 rounded-sm"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tournament Highlight Skeleton */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl relative overflow-hidden animate-pulse space-y-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-6 w-6 rounded-lg bg-slate-800/60 animate-pulse"></div>
                      <div className="h-3 w-36 bg-slate-800/50 rounded-md"></div>
                    </div>
                    <div className="h-4 w-4/5 bg-slate-800/60 rounded-md"></div>
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-slate-800/40 rounded-md"></div>
                      <div className="h-3 w-5/6 bg-slate-800/40 rounded-md"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950/40 border border-slate-850 rounded-xl">
                      <div className="space-y-1">
                        <div className="h-2.5 w-12 bg-slate-800/40 rounded-md"></div>
                        <div className="h-3.5 w-16 bg-slate-800/60 rounded-md"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2.5 w-12 bg-slate-800/40 rounded-md"></div>
                        <div className="h-3.5 w-16 bg-slate-800/60 rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-3 w-28 bg-slate-800/40 rounded-md"></div>
                      <div className="h-6 w-20 bg-slate-800/65 rounded-xl"></div>
                    </div>
                  </div>

                  {/* Live Match Lobby Skeleton */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl relative overflow-hidden animate-pulse space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.55">
                        <div className="h-2 w-2 rounded-full bg-slate-800"></div>
                        <div className="h-3 w-28 bg-slate-800/50 rounded-md"></div>
                      </div>
                      <div className="h-2.5 w-16 bg-slate-800/40 rounded-md"></div>
                    </div>
                    <div className="h-10 bg-slate-950/60 border border-slate-850 rounded-2xl flex items-center justify-between p-2.5">
                      <div className="space-y-1">
                        <div className="h-2 w-20 bg-slate-800/40 rounded-sm"></div>
                        <div className="h-4 w-32 bg-slate-800/60 rounded-md"></div>
                      </div>
                      <div className="h-6 w-6 bg-slate-800/60 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Profile Widget Card */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl relative overflow-hidden shadow-[0_0_15px_rgba(15,23,42,0.4)]">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full bg-[#facc15]/5 blur-2xl"></div>
                    
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/50">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-10 w-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                          {currentUser.avatarUrl}
                        </div>
                        <div>
                          <h4 className="text-[12.5px] font-bold text-white flex items-center gap-1">
                            @{currentUser.username}
                            <CheckSquare className="w-3.5 h-3.5 fill-[#facc15] text-[#020617] rounded-sm" />
                          </h4>
                          <p className="text-[9px] text-zinc-500 font-mono">ID: {currentUser.telegramId}</p>
                        </div>
                      </div>
                      
                      <span className="text-[9px] font-bold font-mono tracking-widest text-[#facc15] bg-[#facc15]/5 border border-[#facc15]/20 rounded-full px-2.5 py-0.5">
                        PRO GLADIATOR
                      </span>
                    </div>

                    {/* COMPUTED NAIRA LEDGER BALANCE */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Computed Ledger Cash</span>
                        
                        {/* Interactive manual fetch trigger */}
                        <button
                          onClick={() => {
                            setIsFetchingDashboard(true);
                            setTimeout(() => setIsFetchingDashboard(false), 1100);
                          }}
                          className="text-zinc-500 hover:text-[#facc15] transition-colors p-1"
                          title="Refresh Database Nodes"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-3xl font-extrabold font-display text-white tracking-tight leading-none">
                          ₦{calculatedBalance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono font-bold">{currentTenant.currency}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2.5 mt-2 text-[9px] text-zinc-500 font-mono">
                        <span className="text-[#00ff88]/85 font-semibold">Inflows: ₦{creditSum.toLocaleString()}</span>
                        <span>|</span>
                        <span className="text-rose-400/85 font-semibold">Outflows: ₦{debitSum.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* QUICK ACTIONS GRID */}
                    <div className="grid grid-cols-4 gap-2 mt-5">
                      <button 
                        onClick={() => setActiveTab('arena_list')}
                        className="flex flex-col items-center bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/30 p-2 rounded-2xl group transition-all duration-300 cursor-pointer"
                      >
                        <div className="h-8 w-8 bg-[#facc15]/10 group-hover:bg-[#facc15]/20 text-[#facc15] rounded-xl flex items-center justify-center mb-1">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <span className="text-[8.5px] font-bold font-mono uppercase text-zinc-400 group-hover:text-white">Arena</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('deposit')}
                        className="flex flex-col items-center bg-slate-950/70 border border-slate-800/80 hover:border-[#00ff88]/30 p-2 rounded-2xl group transition-all duration-300 cursor-pointer"
                      >
                        <div className="h-8 w-8 bg-[#00ff88]/10 group-hover:bg-[#00ff88]/20 text-[#00ff88] rounded-xl flex items-center justify-center mb-1">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <span className="text-[8.5px] font-bold font-mono uppercase text-zinc-400 group-hover:text-white">Deposit</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('withdraw')}
                        className="flex flex-col items-center bg-slate-950/70 border border-slate-800/80 hover:border-red-500/30 p-2 rounded-2xl group transition-all duration-300 cursor-pointer"
                      >
                        <div className="h-8 w-8 bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center mb-1">
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <span className="text-[8.5px] font-bold font-mono uppercase text-zinc-400 group-hover:text-white">Payout</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('teams')}
                        className="flex flex-col items-center bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/30 p-2 rounded-2xl group transition-all duration-300 cursor-pointer"
                      >
                        <div className="h-8 w-8 bg-sky-500/10 group-hover:bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-1">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-[8.5px] font-bold font-mono uppercase text-zinc-400 group-hover:text-white">Clans</span>
                      </button>
                    </div>

                  </div>

                  {/* 1. UPCOMING TOURNAMENT HIGHLIGHT CARD (Free Fire) */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-2 right-3 font-mono text-[8px] bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      UPCOMING CUP
                    </div>

                    <div className="flex items-center space-x-2.5 mb-2 mt-1">
                      <span className="p-1 rounded-lg bg-orange-500/10 text-orange-500">
                        <Flame className="w-4 h-4 fill-orange-500/15" />
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#00ff88] font-bold">Nigeria Free Fire Showdown</span>
                    </div>

                    <h3 className="font-semibold text-xs text-white">Lagos Masters Elite: Purgatory Final</h3>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                      Secure map registry. Live commentary generated instantly upon match dispatch.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-950/50 border border-slate-800/60 rounded-xl text-[10px]">
                      <div>
                        <span className="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold font-mono">Entry stake</span>
                        <span className="font-mono text-white font-bold">₦1,500</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold font-mono">Prize Pool</span>
                        <span className="font-mono text-[#facc15] font-extrabold text-[11px] shadow-sm">₦120,000</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-800/50">
                      <span className="text-[9.5px] text-zinc-400 font-mono">
                        Headcount: <span className="font-bold text-white">28</span> / 48 Slots
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedTournamentId('tour_01');
                          setActiveTab('arena_details');
                        }}
                        className="bg-[#facc15] hover:bg-yellow-500 text-slate-950 font-bold px-3 py-1 rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center cursor-pointer shadow-md"
                      >
                        <span>Join Cup</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. LIVE MATCH / LOBBY CODE ACTIVE */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase tracking-wide">MATCH LOBBY RELEASING</span>
                      </div>
                      <span className="font-mono text-[8px] text-zinc-400">STARTS IN 8 mins</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[7.5px] font-mono uppercase tracking-widest text-zinc-500 block">Simulated Custom Code</span>
                        <span className="font-mono text-xs font-bold text-[#facc15] tracking-widest">ARENA_NIGERIA_99812</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('ARENA_NIGERIA_99812', 'Custom Room Code')}
                        className="bg-slate-900 hover:bg-slate-800 p-1.5 rounded-xl border border-slate-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[9.5px] text-zinc-500 leading-normal mt-2">
                      Enter code in Custom Game mode in Free Fire immediately. Strict anti-cheat protocol logs user logins.
                    </p>
                  </div>

                  {/* 3. LATEST TOURNAMENT WINNER HIGHLIGHT (Binance standard) */}
                  <div className="bg-[#0f172a] border border-[#1f2937] p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center text-[#facc15]">
                        <Crown className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold">Latest Arena Victory</span>
                        <p className="text-[10.5px] font-bold text-slate-200">@ViperKing_NG claims Apex Trio Arena</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono font-extrabold text-[#facc15] block">₦65,000 Won</span>
                      <span className="text-[7.5px] text-zinc-500">Payout: Dispatched</span>
                    </div>
                  </div>

                  {/* Referral Panel */}
                  <div className="bg-gradient-to-r from-slate-900 to-[#1e1b4b]/20 border border-[#1f2937] rounded-2xl p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5 text-[#0088ff]" /> Affiliate Program
                      </h5>
                      <p className="text-[9.5px] text-zinc-500 mt-1 truncate max-w-[220px]">
                        Share referral link and pocket 5% of their deposit values.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => copyToClipboard(`https://t.me/BattleArenaBot?start=${currentUser.referralCode}`, 'Referral Link')}
                      className="p-1 px-3 bg-[#0f172a] hover:bg-slate-800 text-zinc-300 font-mono text-[9px] rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Copy invite
                    </button>
                  </div>

                </div>
              )
            )}

            {/* C. TOURNAMENT LIST SCREEN */}
            {activeTab === 'arena_list' && (
              isFetchingTournaments ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Page title and count skeleton */}
                  <div className="flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 bg-slate-800/60 rounded-md"></div>
                      <div className="h-4 w-32 bg-slate-800/60 rounded-md"></div>
                    </div>
                    <div className="h-5 w-24 bg-slate-850 rounded-full"></div>
                  </div>

                  {/* Filter Grid tabs skeleton */}
                  <div className="grid grid-cols-4 gap-1 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 bg-slate-850 border border-slate-900 rounded-full"></div>
                    ))}
                  </div>

                  {/* Multiple staggered tournament list item skeletons */}
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl relative animate-pulse space-y-3"
                    >
                      <div className="flex justify-between items-center font-mono">
                        <div className="h-4.5 w-16 bg-slate-850 rounded border border-slate-900"></div>
                        <div className="h-3 w-28 bg-slate-800/45 rounded-md"></div>
                      </div>

                      <div className="h-4 w-3/5 bg-slate-800/60 rounded-md"></div>
                      <div className="space-y-1.5">
                        <div className="h-3 w-full bg-slate-800/40 rounded-md"></div>
                        <div className="h-3 w-5/6 bg-slate-800/40 rounded-md"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950/40 border border-slate-850 rounded-xl">
                        <div className="space-y-1">
                          <div className="h-2.5 w-12 bg-slate-800/40 rounded-md"></div>
                          <div className="h-3.5 w-16 bg-slate-800/60 rounded-md"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2.5 w-12 bg-slate-800/40 rounded-md"></div>
                          <div className="h-3.5 w-20 bg-slate-800/60 rounded-md"></div>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800/50 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="h-3 w-24 bg-slate-800/40 rounded-md"></div>
                          <div className="h-1.5 w-20 bg-slate-950 rounded-full"></div>
                        </div>
                        <div className="h-7 w-20 bg-slate-800/60 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-sm flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-[#facc15]" /> Available Matches
                      
                      {/* Manual Refresh icon trigger */}
                      <button
                        onClick={() => {
                          setIsFetchingTournaments(true);
                          setTimeout(() => setIsFetchingTournaments(false), 1100);
                        }}
                        className="ml-2 text-zinc-500 hover:text-[#facc15] transition-colors p-1"
                        title="Sync Regional Node Data"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </h3>
                    <span className="text-[9px] bg-slate-900 text-zinc-500 px-2.5 py-0.5 rounded-full font-mono border border-slate-800">
                      {tenantTournaments.length} Matches scoped
                    </span>
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-4 gap-1 select-none font-mono">
                  <button className="bg-[#facc15] text-[#020617] font-bold font-mono text-[9px] py-1 rounded-full uppercase tracking-wider">
                    ALL
                  </button>
                  <button className="bg-slate-900 text-zinc-500 font-semibold font-mono text-[9px] py-1 rounded-full uppercase tracking-wider border border-slate-800">
                    UPCOMING
                  </button>
                  <button className="bg-slate-900 text-zinc-500 font-semibold font-mono text-[9px] py-1 rounded-full uppercase tracking-wider border border-slate-800">
                    ROOMS
                  </button>
                  <button className="bg-slate-900 text-zinc-500 font-semibold font-mono text-[9px] py-1 rounded-full uppercase tracking-wider border border-slate-800">
                    PAST
                  </button>
                </div>

                {tenantTournaments.length === 0 ? (
                  <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-[#1f2937] text-zinc-500 text-xs font-mono">
                    Empty Tenant DB Registry.
                    <p className="text-[10px] mt-1.5 text-zinc-650">Open settings inside Profile tab to draft AI matches instantly.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tenantTournaments.map(match => {
                      const isRegistered = ledger.some(l => l.reference === `REG-${match.id}`);
                      return (
                        <div 
                          key={match.id} 
                          className="bg-[#0f172a] border border-[#1f2937] hover:border-slate-700 p-3.5 rounded-3xl transition relative"
                        >
                          <div className="flex justify-between items-center text-[9px] mb-2 font-mono">
                            <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80 font-bold text-[#facc15] uppercase tracking-wide">
                              {match.gameName}
                            </span>
                            <span className="text-zinc-500 flex items-center gap-1 font-mono text-[9px]">
                              <Clock className="w-3.5 h-3.5 text-[#facc15]" /> {match.scheduledTime}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-slate-100">{match.title}</h4>
                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {match.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2 mt-3.5 p-2 bg-slate-950/40 border border-slate-800/50 rounded-xl text-[10px]">
                            <div>
                              <span className="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold font-mono">Entry Stake</span>
                              <span className="font-mono text-white font-bold">
                                {currentTenant.currencySymbol}{match.entryFee.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold font-mono">Prize Pool</span>
                              <span className="font-semibold text-[#facc15] font-extrabold">
                                {currentTenant.currencySymbol}{match.prizePool.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-2.5 border-t border-slate-800/50 flex items-center justify-between text-xs">
                            <div className="flex flex-col">
                              <span className="text-[9.5px] text-zinc-400 font-mono">
                                Registered: <span className="font-bold text-white">{match.currentParticipants}</span> / {match.maxParticipants}
                              </span>
                              <div className="h-1 w-20 bg-slate-950 border border-slate-900 rounded-full overflow-hidden mt-1 p-0.2">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#facc15] to-yellow-500"
                                  style={{ width: `${(match.currentParticipants / match.maxParticipants) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* CTAs BASED ON STATUS AND REGISTER STATE */}
                            {match.status === 'completed' ? (
                              <span className="text-[8.5px] bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 px-2 py-0.5 rounded-full font-bold uppercase font-mono">
                                Victor: {match.winnerPlayerName}
                              </span>
                            ) : isRegistered ? (
                              <div className="flex items-center gap-1.5">
                                {match.status === 'room_released' ? (
                                  <span className="text-[8.5px] bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 px-2 py-0.5 rounded-full font-bold font-mono animate-pulse">
                                    🔑 ROOM Code Active
                                  </span>
                                ) : match.status === 'playing' ? (
                                  <span className="text-[8.5px] bg-[#0088ff]/10 text-[#0088ff] border border-[#0088ff]/20 px-2 py-0.5 rounded-full font-bold font-mono animate-pulse uppercase">
                                    🔴 LIVE Match
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-zinc-500 font-mono font-bold">Registered</span>
                                )}

                                <button
                                  onClick={() => onPlayTournament(match.id)}
                                  disabled={isGeneratingCommentary}
                                  className="bg-[#facc15] hover:bg-yellow-500 text-slate-950 font-extrabold px-3 py-1 rounded-xl text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-slate-950 text-slate-950" />
                                  <span>{isGeneratingCommentary ? '...' : 'Play'}</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedTournamentId(match.id);
                                  setActiveTab('arena_details');
                                }}
                                className="bg-[#facc15] hover:bg-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-[9px] font-mono uppercase tracking-wider cursor-pointer shadow-sm"
                              >
                                Join Arena
                              </button>
                            )}
                          </div>

                          {/* Commentary Panel */}
                          {commentaryLogs[match.id] && (
                            <div className="mt-3.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-[10px] font-mono text-[#facc15] leading-relaxed shadow-inner">
                              <div className="text-[8px] text-zinc-500 uppercase tracking-widest border-b border-slate-900 pb-1 mb-2 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span> AI Arena Commentary
                              </div>
                              <pre className="whitespace-pre-wrap font-mono text-[9px] leading-snug">{commentaryLogs[match.id]}</pre>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              )
            )}

            {/* D. TOURNAMENT DETAILS SCREEN */}
            {activeTab === 'arena_details' && selectedTournament && (
              <div className="space-y-4 animate-fadeIn">
                <button 
                  onClick={() => setActiveTab('arena_list')}
                  className="text-[9.5px] font-bold text-zinc-500 hover:text-white uppercase font-mono flex items-center gap-1 cursor-pointer"
                >
                  ✕ Exit Arena Detail
                </button>

                {/* Banner map view */}
                <div className="bg-[#0f172a] border border-[#1f2937] rounded-3xl overflow-hidden relative p-4 shadow-xl">
                  {/* Glowing crosshair graphics */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-[#facc15]/5 pointer-events-none flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-dashed border-[#facc15]/10"></div>
                  </div>

                  <div className="relative z-10 pb-16 pt-4">
                    <span className="bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 font-bold px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest">
                      {selectedTournament.gameName} SPEC
                    </span>
                    <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white mt-3 leading-snug">
                      {selectedTournament.title}
                    </h2>
                    
                    <p className="text-[10px] text-zinc-400 mt-2 font-mono">
                      MAP REGISTRY: <span className="text-[#facc15] font-extrabold uppercase">Bermuda (Free Fire)</span>
                    </p>
                  </div>

                  {/* Absolute metadata badges */}
                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center text-xs">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-xl font-mono border border-slate-800 text-[10px] text-zinc-400">
                      Mode: <span className="text-white font-bold">Solo Queue</span>
                    </span>
                    <span className="bg-[#22c55e]/10 px-2.5 py-1 rounded-xl font-mono border border-[#22c55e]/25 text-[10px] text-emerald-400 font-bold">
                      Anti-Cheat Shield Active
                    </span>
                  </div>
                </div>

                {/* Specs breakdown */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl space-y-3 text-xs leading-normal">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono border-b border-slate-800 pb-1.5 flex items-center gap-1">
                    <span>✦</span> Arena Rules and Specifications
                  </h4>

                  <ul className="space-y-2 text-zinc-500 text-[10.5px]">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#facc15] mt-0.5 font-bold">•</span>
                      <span>Stated prize pools are paid out atomically to the victor's wallet immediately upon gameplay confirmation.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#facc15] mt-0.5 font-bold">•</span>
                      <span>Room codes are released exactly 15 minutes before the match starts. Copy and join custom lobbies promptly.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[#facc15] mt-0.5 font-bold">•</span>
                      <span>Lag-tampering, hacking,/utilizing emulator scripts results in immediate hardware ban and ledger seizure.</span>
                    </li>
                  </ul>
                </div>

                {/* Prize Pool Breakdown */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl space-y-2.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono border-b border-slate-800 pb-1.5">
                     Match Stakes Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                      <span className="text-[8px] text-zinc-500 uppercase font-mono font-bold block">Grand Prize Pool</span>
                      <span className="text-lg font-bold text-[#facc15] font-mono">
                        {currentTenant.currencySymbol}{selectedTournament.prizePool.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                      <span className="text-[8px] text-zinc-500 uppercase font-mono font-bold block">Entry Handshake Stake</span>
                      <span className="text-lg font-bold text-white font-mono">
                        {currentTenant.currencySymbol}{selectedTournament.entryFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big register CTA button */}
                <div className="pt-2 select-none">
                  {ledger.some(l => l.reference === `REG-${selectedTournament.id}`) ? (
                    <div className="w-full bg-slate-900 border border-slate-800 text-zinc-500 text-center py-3.5 rounded-2xl font-bold font-mono text-xs uppercase tracking-widest">
                       REGISTERED IN MATCH
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (calculatedBalance < selectedTournament.entryFee) {
                          alert(`Ledger Error: Insufficient computed cash. Please deposit another ${currentTenant.currencySymbol}${(selectedTournament.entryFee - calculatedBalance).toLocaleString()} to qualify.`);
                          return;
                        }
                        onRegisterTournament(selectedTournament.id, selectedTournament.entryFee);
                        triggerToast(`Joined match: stake locked!`);
                      }}
                      className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 py-3.5 rounded-2xl text-xs font-black font-mono uppercase tracking-widest text-center block shadow-[0_4px_15px_rgba(250,204,21,0.2)] cursor-pointer"
                    >
                      LOCK ENTRY FEE ({currentTenant.currencySymbol}{selectedTournament.entryFee.toLocaleString()})
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* E. WALLET SCREEN */}
            {activeTab === 'wallet' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-display font-semibold text-sm flex items-center gap-1 select-none">
                  <Wallet className="w-4 h-4 text-[#facc15]" /> Authority Wallet Node
                </h3>

                {/* Ledger card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-4 rounded-3xl relative overflow-hidden shadow-2xl">
                  {/* Diagonal grid stripes */}
                  <div className="absolute inset-0 bg-[#facc15]/2 pointer-events-none"></div>

                  <span className="text-[8.5px] bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                     FINTECH INTEGRITY LEDGER
                  </span>

                  <div className="mt-4">
                    <span className="text-[8px] text-zinc-500 uppercase font-mono block">Computed Available Cash</span>
                    <div className="text-3xl font-black font-display text-white tracking-tight leading-none mt-1">
                      ₦{calculatedBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[7.5px] uppercase">WALLET KEY REF</span>
                      <span className="text-white font-bold">BA-{currentUser.id}-LEDG</span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 block text-[7.5px] uppercase">TENANT SCOPE</span>
                      <span className="text-[#facc15] font-bold">NIGERIA</span>
                    </div>
                  </div>
                </div>

                {/* Quick transfer buttons and invoice actions */}
                <div className="grid grid-cols-2 gap-3 pb-1 select-none">
                  <button 
                    onClick={() => setActiveTab('deposit')}
                    className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 py-3 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_4px_10px_rgba(250,204,21,0.15)] cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Instant Credit</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('withdraw')}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white py-3 rounded-2xl text-xs font-semibold font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Debit Out</span>
                  </button>
                </div>

                {/* Transactions list */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block tracking-widest font-bold">Immutable Ledger Receipts</span>
                  
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {ledger.map(entry => (
                      <div 
                        key={entry.id} 
                        className="bg-[#0f172a] rounded-2xl p-2.5 border border-[#1f2937] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className={`p-1.5 rounded-xl border ${entry.type === 'credit' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {entry.type === 'credit' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          </div>
                          
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[190px]">{entry.description}</span>
                            <span className="text-[8.5px] text-[#555] font-mono block">REF: {entry.reference}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`font-bold font-mono block ${entry.type === 'credit' ? 'text-[#00ff88]' : 'text-zinc-400'}`}>
                            {entry.type === 'credit' ? '+' : '-'}₦{entry.amount.toLocaleString()}
                          </span>
                          <span className="text-[8.5px] text-zinc-500 font-mono">
                            {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {ledger.length === 0 && (
                      <div className="text-center py-8 text-zinc-650 font-mono text-[10px]">No transaction ledger coordinates logged.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* F. DEPOSIT SCREEN (NIGERIA DEPLOY) */}
            {activeTab === 'deposit' && (
              <div className="space-y-4 animate-fadeIn">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="text-[9.5px] font-bold text-zinc-500 hover:text-white uppercase font-mono flex items-center gap-1 cursor-pointer"
                >
                  ✕ Exit Deposit
                </button>

                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-[#00ff88]" /> Instant Bank Transfer (Nigeria NGN)
                </h3>

                {/* Virtual Account Info OPay Style */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-3.5 rounded-3xl space-y-3 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#00ff88]/2 blur-2xl"></div>
                  
                  <div className="flex justify-between items-center text-[10px] pb-1 border-b border-slate-800">
                    <span className="text-zinc-500 uppercase tracking-widest font-bold font-mono">Assigned Wema Virtual Accounts</span>
                    <span className="bg-[#00ff88]/10 text-[#00ff88] px-2 py-0.5 rounded font-mono text-[8px] font-bold">API ACTIVE</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[7.5px] text-zinc-500 uppercase block font-mono">BANK NAME</span>
                        <span className="text-xs font-bold text-white font-mono">Wema Bank / Monnify Gateway</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Nigeria</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[7.5px] text-zinc-500 uppercase block font-mono">ACCOUNT NO (COPY TO TEST)</span>
                        <span className="text-xs font-bold text-[#facc15] font-mono tracking-widest">9812457220</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('9812457220', 'Virtual Account Number')}
                        className="bg-slate-900 border border-slate-800 p-1 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[7.5px] text-zinc-500 uppercase block font-mono">BENEFICIARY ACCOUNT NAME</span>
                        <span className="text-xs font-bold text-white font-mono uppercase">BattleArena - @{currentUser.username}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-zinc-500 leading-normal">
                    Transfer any amount to this account. Our Monnify backend listener detects and credits your secure wallet automatically within seconds.
                  </p>
                </div>

                {/* Simulated Bank Credit Form */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl space-y-3">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono">
                    Simulate Nigerian Bank Transfer
                  </h4>

                  <form onSubmit={handleStartDepositSim} className="space-y-3">
                    <div>
                      <label className="text-[8.5px] uppercase font-mono text-zinc-500 block mb-1">Enter Credit Transfer Amount (₦)</label>
                      <div className="relative font-mono">
                        <span className="absolute left-3 top-1.5 text-xs text-zinc-500 font-bold">₦</span>
                        <input
                          type="number"
                          required
                          placeholder="5000"
                          value={depositAmount}
                          onChange={e => setDepositAmount(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#facc15]"
                        />
                      </div>
                    </div>

                    {!depositSimulating ? (
                      <button
                        type="submit"
                        className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl font-mono uppercase tracking-wider text-center cursor-pointer shadow-md"
                      >
                        Send Mock Transfer (₦)
                      </button>
                    ) : (
                      <div className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between text-xs text-zinc-400 font-mono">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-3.5 h-3.5 text-[#00ff88] animate-spin" />
                          <span className="text-[10px] font-semibold animate-pulse">Waiting for Webhook...</span>
                        </div>
                        <span className="text-[8.5px] text-[#00ff88] bg-[#00ff88]/5 border border-[#00ff88]/20 px-2 py-0.5 rounded-lg">
                           Ref: {depositSuccessRef}
                        </span>
                      </div>
                    )}
                  </form>
                </div>

              </div>
            )}

            {/* G. WITHDRAW SCREEN */}
            {activeTab === 'withdraw' && (
              <div className="space-y-4 animate-fadeIn">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="text-[9.5px] font-bold text-zinc-500 hover:text-white uppercase font-mono flex items-center gap-1 cursor-pointer"
                >
                  ✕ Exit Payout
                </button>

                <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                  <ArrowDownLeft className="w-4 h-4 text-rose-400" /> Instant Debit Payout Dispatcher
                </h3>

                <form onSubmit={handleWithdrawPayout} className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl space-y-3 text-xs">
                  <div>
                    <label className="text-[8.5px] uppercase font-mono text-zinc-500 block mb-1">Select Nigeria Bank</label>
                    <select 
                      value={withdrawBank}
                      onChange={e => setWithdrawBank(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-[11px] text-zinc-200 focus:outline-none font-mono"
                    >
                      <option value="OPay Nigeria">OPay Nigeria</option>
                      <option value="Moniepoint Microfinance Bank">Moniepoint Bank</option>
                      <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTB)</option>
                      <option value="Zenith Bank Plc">Zenith Bank Plc</option>
                      <option value="Palmpay Limited">Palmpay</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8.5px] uppercase font-mono text-zinc-500 block mb-1">Recipient Account Number (10 Digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="0123456789"
                      value={withdrawAccount}
                      onChange={e => setWithdrawAccount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-[11px] text-zinc-200 focus:outline-none font-mono font-bold tracking-widest placeholder:tracking-normal focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[8.5px] uppercase font-mono text-zinc-500 block mb-1">Debit Amount (₦)</label>
                    <div className="relative font-mono">
                      <span className="absolute left-2.5 top-1.5 text-xs text-zinc-500 font-bold">₦</span>
                      <input
                        type="number"
                        required
                        placeholder="2000"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Lock Debit Payout Dispatch
                  </button>
                </form>

                {/* Withdraw Payout History tracker list */}
                {withdrawHistory.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block tracking-widest font-bold">Payout Progress Logs</span>
                    
                    <div className="space-y-1.5">
                      {withdrawHistory.map(item => (
                        <div key={item.id} className="bg-[#0f172a] rounded-2xl p-2.5 border border-[#1f2937] flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10.5px] font-bold text-white">₦{item.amount.toLocaleString()}</span>
                              <span className="text-[8px] bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 text-zinc-500 font-mono">
                                {item.id}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono block uppercase mt-0.5">{item.bank} • {item.account}</span>
                          </div>

                          <div className="text-right">
                            <span className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wide border ${
                              item.status === 'Paid' ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/20' :
                              item.status === 'Approved' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[8.5px] text-zinc-500 font-mono block mt-1">{item.timestamp.split(' ')[1] || item.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* H. LEADERBOARD SCREEN */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between select-none">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-1">
                    <Crown className="w-4 h-4 text-[#facc15]" /> Top Gladiators Tiers
                  </h3>

                  <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[8.5px] font-mono">
                    <button 
                      onClick={() => setLeaderboardPeriod('global')}
                      className={`px-2 py-0.5 rounded uppercase font-bold text-center ${leaderboardPeriod === 'global' ? 'bg-[#facc15] text-slate-950' : 'text-zinc-500'}`}
                    >
                      GLOBAL
                    </button>
                    <button 
                      onClick={() => setLeaderboardPeriod('weekly')}
                      className={`px-2 py-0.5 rounded uppercase font-bold text-center ${leaderboardPeriod === 'weekly' ? 'bg-[#facc15] text-slate-950' : 'text-zinc-500'}`}
                    >
                      WEEKLY
                    </button>
                  </div>
                </div>

                {/* TOP 3 GOLD GLOW PODIUM FRAMES */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 pb-2 items-end select-none">
                  
                  {/* #2 Rank Podium block */}
                  <div className="flex flex-col items-center bg-[#0f172a] border border-[#1f2937] p-3 rounded-2xl relative shadow-md">
                    <div className="absolute top-[-10px] h-6 w-6 bg-slate-950 rounded-full border border-[#1f2937] flex items-center justify-center text-[10px] font-bold text-zinc-300">
                      2
                    </div>
                    <span className="text-xl">🤵</span>
                    <span className="text-[8.5px] font-bold font-mono text-zinc-300 text-center block truncate max-w-full mt-1.5">
                      {globalLeaderboard[1].name}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500 mt-0.5">
                      ₦{globalLeaderboard[1].earnings.toLocaleString()}
                    </span>
                  </div>

                  {/* #1 GOLD GLOW Master Podium */}
                  <div className="flex flex-col items-center bg-[#0f172a] border-2 border-[#facc15] p-3.5 pb-4 rounded-3xl relative shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                    <div className="absolute top-[-15px] h-8 w-8 bg-[#facc15] text-slate-950 rounded-full border-2 border-[#020617] flex items-center justify-center font-bold font-mono">
                      👑
                    </div>
                    <span className="text-2xl mt-1">🥷</span>
                    <span className="text-[9.5px] font-black font-mono text-white text-center block truncate max-w-full mt-2">
                       {globalLeaderboard[0].name}
                    </span>
                    <span className="text-[9.5px] font-extrabold font-mono text-[#facc15] mt-1">
                      ₦{globalLeaderboard[0].earnings.toLocaleString()}
                    </span>
                  </div>

                  {/* #3 Rank Podium block */}
                  <div className="flex flex-col items-center bg-[#0f172a] border border-[#1f2937] p-3 rounded-2xl relative shadow-md">
                    <div className="absolute top-[-10px] h-6 w-6 bg-slate-950 rounded-full border border-[#1f2937] flex items-center justify-center text-[10px] font-bold text-zinc-300">
                      3
                    </div>
                    <span className="text-xl">🧙</span>
                    <span className="text-[8.5px] font-bold font-mono text-zinc-300 text-center block truncate max-w-full mt-1.5">
                      {globalLeaderboard[2].name}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500 mt-0.5">
                      ₦{globalLeaderboard[2].earnings.toLocaleString()}
                    </span>
                  </div>

                </div>

                {/* Standard Ranking list */}
                <div className="space-y-1.5 select-all">
                  {globalLeaderboard.slice(3).map((player, idx) => (
                    <div key={idx} className="bg-[#0f172a] border border-[#1f2937] p-2.5 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-zinc-500 font-bold block w-4">{player.rank}</span>
                        <div className="h-6 w-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                          🎮
                        </div>
                        <span className="font-bold text-slate-200 font-mono text-[11px]">{player.name}</span>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <span className="font-extrabold text-[#facc15] block">₦{player.earnings.toLocaleString()}</span>
                        <span className="text-[8px] text-zinc-500">{player.wins} Wins logged</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* I. TEAM SCREEN */}
            {activeTab === 'teams' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-1">
                    <Users className="w-4 h-4 text-sky-450" /> Active Regional Clans
                  </h3>

                  <button 
                    onClick={() => setShowClanModal(true)}
                    className="bg-[#facc15] hover:bg-yellow-500 text-slate-950 font-bold px-3 py-1 rounded-xl text-[9.5px] font-mono uppercase tracking-widest cursor-pointer"
                  >
                    + Create Clan
                  </button>
                </div>

                {tenantTeams.length === 0 ? (
                  <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-[#1f2937] text-zinc-500 text-xs font-mono">
                    No squads registered inside NGN Tenant node database.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {tenantTeams.map(team => (
                      <div 
                        key={team.id} 
                        className="bg-[#0f172a] border border-[#1f2937] p-3 rounded-2xl flex items-center space-x-3.5 relative overflow-hidden"
                      >
                        <div className="h-9 w-9 bg-slate-950 rounded-xl flex items-center justify-center text-lg border border-slate-800">
                          {team.logoUrl}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-white truncate max-w-[120px]">{team.name}</h4>
                            <span className="text-[7.5px] font-mono text-[#facc15] bg-[#facc15]/5 border border-[#facc15]/10 rounded px-1.5 py-0.2 font-bold uppercase">
                              Active Clan
                            </span>
                          </div>
                          
                          <p className="text-[8.5px] text-zinc-500 font-mono mt-1">
                            ROSTER: {team.memberNames.join(', ')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* J. PROFILE SCREEN */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Visual Avatar Card */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-4 rounded-3xl flex items-center space-x-4 shadow">
                  <div className="h-14 w-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner shadow-black">
                     {currentUser.avatarUrl}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1">
                      @{currentUser.username}
                      <CheckCircle className="w-3.5 h-3.5 fill-[#facc15] text-[#020617]" />
                    </h4>
                    <p className="text-[9.5px] text-zinc-500 font-mono mt-0.5">Secure TeleID: {currentUser.telegramId}</p>
                    <p className="text-[8.5px] text-[#00ff88] bg-[#00ff88]/5 font-mono px-2 py-0.2 rounded mt-1 w-fit border border-[#00ff88]/10 font-bold">
                      SHA256 Auth Verified
                    </p>
                  </div>
                </div>

                {/* 4 horizontal stats widgets */}
                <div className="grid grid-cols-2 gap-2.5 text-xs text-center">
                  <div className="bg-[#0f172a] border border-[#1f2937] p-2.5 rounded-2xl">
                    <span className="text-[7.5px] uppercase text-zinc-550 block font-mono font-bold">Arena matches played</span>
                    <span className="text-base font-extrabold text-white font-mono mt-0.5 block">24</span>
                  </div>
                  <div className="bg-[#0f172a] border border-[#1f2937] p-2.5 rounded-2xl">
                    <span className="text-[7.5px] uppercase text-zinc-550 block font-mono font-bold">Victory Cup Wins</span>
                    <span className="text-base font-extrabold text-[#facc15] font-mono mt-0.5 block">8</span>
                  </div>
                  <div className="bg-[#0f172a] border border-[#1f2937] p-2.5 rounded-2xl">
                    <span className="text-[7.5px] uppercase text-zinc-550 block font-mono font-bold">Confirmed Killcount</span>
                    <span className="text-base font-extrabold text-white font-mono mt-0.5 block">112</span>
                  </div>
                  <div className="bg-[#0f172a] border border-[#1f2937] p-2.5 rounded-2xl">
                    <span className="text-[7.5px] uppercase text-zinc-550 block font-mono font-bold">Total Cash Earnings</span>
                    <span className="text-base font-extrabold text-[#00ff88] font-mono mt-0.5 block">₦{globalLeaderboard[1].earnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* EXPANDABLE INTEGRATED DEVELOPER DRAWER TOGGLE BUTTON */}
                <div className="pt-2 select-none">
                  <button 
                    onClick={() => setShowDevDrawer(!showDevDrawer)}
                    className="w-full bg-slate-900 leading-none group text-[#facc15] py-3.5 rounded-2xl text-xs font-bold font-mono uppercase tracking-widest border border-[#facc15]/30 flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(250,204,21,0.06)]"
                  >
                    <Terminal className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
                    <span>🛠️ Developer & SaaS Node Console</span>
                  </button>
                </div>

                {/* BOT INTEG NOTIFICATIONS LOG (SIMULATE TELEGRAM BOT ALERT POOL) */}
                <div className="bg-[#0f172a] border border-[#1f2937] p-3 rounded-2xl text-xs">
                  <span className="text-[8.5px] font-mono font-extrabold text-zinc-500 uppercase tracking-widest block mb-1.5">Telegram Bot Alerts Feed</span>
                  
                  <div className="bg-slate-950 rounded-xl border border-slate-900 h-28 overflow-y-auto p-2 space-y-1.5 select-none">
                    {notifications.filter(n => n.tenantId === currentTenant.id).map(notif => (
                      <div key={notif.id} className="text-[9.5px] bg-[#0f172a] p-2 rounded-xl border border-slate-800 text-zinc-300 font-mono">
                        <div className="flex justify-between items-center text-[7.5px] text-zinc-500 mb-0.5">
                          <span className="font-bold uppercase text-[#facc15]">{notif.type} Alert</span>
                          <span>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[9.5px] leading-snug">{notif.message}</p>
                      </div>
                    ))}
                    {notifications.filter(n => n.tenantId === currentTenant.id).length === 0 && (
                      <div className="text-center py-8 text-zinc-650 text-[9px] font-mono">Empty Bot Feed.</div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* K. EXPANDED INTEGRATED DEVELOPER SAAS DRAWER NODE */}
            {showDevDrawer && (
              <div className="absolute inset-x-2 bottom-12 top-11 z-[45] bg-[#0f172a] border border-[#facc15]/30 rounded-3xl p-4 shadow-2xl flex flex-col justify-between select-all antialiased animate-slideUp">
                
                {/* Drawer header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-1.5 text-[#facc15]">
                    <Database className="w-4 h-4 animate-pulse" />
                    <span className="font-mono text-xs font-bold tracking-wider">SaaS MySQL Real-Time Ledger Engine</span>
                  </div>
                  <button 
                    onClick={() => setShowDevDrawer(false)}
                    className="text-zinc-500 hover:text-white font-mono text-xs font-bold cursor-pointer"
                  >
                    ✕ Close Panel
                  </button>
                </div>

                {/* Sub Tab selection */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-900 text-[8.5px] font-mono select-none mt-2">
                  <button 
                    onClick={() => setDevTab('cron')}
                    className={`py-1 rounded-lg uppercase font-bold text-center ${devTab === 'cron' ? 'bg-[#facc15] text-[#020617]' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                     Crons
                  </button>
                  <button 
                    onClick={() => setDevTab('database')}
                    className={`py-1 rounded-lg uppercase font-bold text-center ${devTab === 'database' ? 'bg-[#facc15] text-[#020617]' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                     Ledger Triggers
                  </button>
                  <button 
                    onClick={() => setDevTab('php_src')}
                    className={`py-1 rounded-lg uppercase font-bold text-center ${devTab === 'php_src' ? 'bg-[#facc15] text-[#020617]' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                     PHP Code
                  </button>
                  <button 
                    onClick={() => setDevTab('ai_draft')}
                    className={`py-1 rounded-lg uppercase font-bold text-center ${devTab === 'ai_draft' ? 'bg-[#facc15] text-[#020617]' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                     Gemini AI
                  </button>
                </div>

                {/* Scrollable Container block */}
                <div className="flex-1 overflow-y-auto my-3 p-1.5 space-y-3 bg-[#020617] rounded-2xl border border-slate-800 shadow-inner">
                  
                  {/* Cron tab contents */}
                  {devTab === 'cron' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-[8.5px] font-mono uppercase text-zinc-550 block font-bold tracking-widest pl-0.5">Automated Multi-Tenant PHP Daemons</span>
                      
                      <div className="grid grid-cols-2 gap-2 p-0.5">
                        <button 
                          onClick={() => onRunCron('release_rooms.php')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[#facc15] p-2.5 rounded-xl font-mono text-[9.5px] font-bold uppercase text-left relative overflow-hidden group cursor-pointer"
                        >
                          <span className="block font-bold">Lobbies</span>
                          <span className="text-[7.5px] text-zinc-500 font-sans block normal-case mt-0.5">release_rooms.php</span>
                        </button>

                        <button 
                          onClick={() => onRunCron('process_wallets.php')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 p-2.5 rounded-xl font-mono text-[9.5px] font-bold uppercase text-left relative overflow-hidden group cursor-pointer"
                        >
                          <span className="block font-bold">Audit Ledgers</span>
                          <span className="text-[7.5px] text-zinc-500 font-sans block normal-case mt-0.5">process_wallets.php</span>
                        </button>

                        <button 
                          onClick={() => onRunCron('update_leaderboard.php')}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-orange-400 p-2.5 rounded-xl font-mono text-[9.5px] font-bold uppercase text-left relative overflow-hidden group cursor-pointer"
                        >
                          <span className="block font-bold">Rankings</span>
                          <span className="text-[7.5px] text-zinc-500 font-sans block normal-case mt-0.5">update_leaderboard.php</span>
                        </button>

                        <button 
                          onClick={onClearDatabase}
                          className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-550 text-rose-400 p-2.5 rounded-xl font-mono text-[9.5px] font-bold uppercase text-left relative overflow-hidden group cursor-pointer"
                        >
                          <span className="block font-bold">Reset database</span>
                          <span className="text-[7.5px] text-rose-550 font-sans block normal-case mt-0.5">truncate tables</span>
                        </button>
                      </div>

                      {/* Display Audit logs in mini output */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[8px] font-mono uppercase text-zinc-600 font-extrabold tracking-widest pl-0.5 block">SQL Query trace logs (Audit logs)</span>
                        <div className="bg-slate-950 p-2 border border-slate-900 h-28 overflow-y-auto rounded-xl font-mono text-[9px] text-zinc-400 space-y-1.5">
                          {auditLogs.map(log => (
                            <div key={log.id} className="border-b border-slate-900 pb-1.5 mb-1 bg-[#020617] p-1.5 rounded border border-slate-800">
                              <span className="bg-[#facc15]/10 text-[#facc15] px-1 rounded font-bold uppercase text-[7.5px] tracking-wide inline-block mr-1">
                                {log.event}
                              </span>
                              <span className="text-zinc-650 opacity-60 text-[7.5px]">{log.timestamp}</span>
                              <p className="text-[9.5px] text-zinc-300 leading-tight mt-0.5">{log.details}</p>
                              {log.sqlQuery && (
                                <code className="block mt-1 font-mono text-[8px] text-[#00ff88]/85 select-all overflow-x-auto break-all bg-black p-1 rounded border border-slate-900">
                                  {log.sqlQuery};
                                </code>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual database triggers */}
                  {devTab === 'database' && (
                    <div className="space-y-3.5 text-xs">
                      <span className="text-[8.5px] font-mono uppercase text-zinc-550 block font-bold tracking-widest pl-0.5">Direct SQL Ledger write</span>
                      
                      <form onSubmit={handleLocalLedgerInject} className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[7.5px] uppercase font-mono text-zinc-500 block mb-0.5">Direction Type</label>
                            <select 
                              value={manualType}
                              onChange={e => setManualType(e.target.value as 'credit' | 'debit')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10.5px] text-zinc-300 focus:outline-none font-mono"
                            >
                              <option value="credit">CREDIT (+) INFLOW</option>
                              <option value="debit">DEBIT (-) OUTFLOW</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[7.5px] uppercase font-mono text-zinc-500 block mb-0.5">Lock Amount</label>
                            <input 
                              type="number"
                              required
                              placeholder="2500"
                              value={manualAmount}
                              onChange={e => setManualAmount(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10.5px] text-white focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[7.5px] uppercase font-mono text-zinc-500 block mb-0.5">Manual Entry Description (Immutable Log)</label>
                          <input 
                            type="text"
                            required
                            placeholder="Direct simulated credit admin top-up"
                            value={manualDescription}
                            onChange={e => setManualDescription(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10.5px] text-white focus:outline-none font-mono"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 py-2 rounded-lg font-mono text-[9.5px] font-bold uppercase cursor-pointer shadow-sm text-center block"
                        >
                           Inject Raw Ledger Entry
                        </button>
                      </form>

                      {/* Display Computed Live balances stats */}
                      <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 font-mono text-[9px] text-zinc-400 space-y-1">
                        <span className="text-[8px] text-zinc-600 block uppercase font-bold border-b border-slate-900 pb-0.5 mb-1">Accounting balance check:</span>
                        <div className="flex justify-between">
                          <span>SUM(credit):</span> <span className="text-[#00ff88]">₦{creditSum.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SUM(debit):</span> <span className="text-zinc-500">₦{debitSum.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-900 pt-0.5 font-bold">
                          <span>Computed Balance:</span> <span className="text-[#facc15]">₦{calculatedBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHP Core code viewer */}
                  {devTab === 'php_src' && (
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[8.5px] font-mono uppercase text-zinc-550 block font-bold tracking-widest pl-0.5">Architecture file explorer</span>
                        <select 
                          value={inspectedFile.path}
                          onChange={e => {
                            const found = ARCHITECTURE_FILES.find(f => f.path === e.target.value);
                            if (found) setInspectedFile(found);
                          }}
                          className="bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[8.5px] text-zinc-300 font-mono focus:outline-none"
                        >
                          {ARCHITECTURE_FILES.map((f, i) => (
                            <option key={i} value={f.path}>{f.path}</option>
                          ))}
                        </select>
                      </div>

                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-mono text-zinc-500 uppercase">{inspectedFile.description}</span>
                          <button 
                            onClick={handleCopyInspectedFile}
                            className="bg-slate-900 hover:bg-slate-800 p-1 rounded border border-slate-800 text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[7px]"
                          >
                            {fileCopied ? <Check className="w-3 h-3 text-[#00ff88]" /> : <Copy className="w-3 h-3" />}
                            <span>{fileCopied ? 'COPIED' : 'COPY'}</span>
                          </button>
                        </div>

                        {/* code body */}
                        <pre className="text-[7.5px] leading-tight font-mono text-slate-350 overflow-x-auto max-h-[160px] p-2 bg-black border border-slate-900 rounded select-all font-semibold select-text">
                          {inspectedFile.code}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Gemini AI tournament drafts */}
                  {devTab === 'ai_draft' && (
                    <div className="space-y-3.5 text-xs">
                      <span className="text-[8.5px] font-mono uppercase text-zinc-550 block font-bold tracking-widest pl-0.5">Server-Side Gemini 3.5 AI Drafter</span>
                      
                      <form onSubmit={handleLocalAiTournamentSubmit} className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[7.5px] uppercase font-mono text-zinc-550 block mb-0.5">Target Game Category</label>
                            <select 
                              value={customGame}
                              onChange={e => setCustomGame(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10.5px] text-zinc-300 font-mono focus:outline-none"
                            >
                              <option value="Free Fire">Free Fire</option>
                              <option value="PUBG Mobile">PUBG Mobile</option>
                              <option value="Call of Duty: Mobile">Call of Duty Mobile</option>
                              <option value="Apex Legends Mobile">Apex Legends Mobile</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[7.5px] uppercase font-mono text-zinc-550 block mb-0.5">Prize Pool (₦)</label>
                            <input 
                              type="number"
                              required
                              placeholder="50000"
                              value={customPrize}
                              onChange={e => setCustomPrize(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10.5px] font-mono text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {isGeneratingTournamentAI ? (
                          <div className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-center text-[10px] font-mono font-bold animate-pulse text-[#facc15] flex items-center justify-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 animate-spin" />
                            <span>Drafting custom lore via @google/genai...</span>
                          </div>
                        ) : (
                          <button 
                            type="submit"
                            className="w-full bg-[#facc15] hover:bg-yellow-500 text-slate-950 py-2 rounded-lg font-mono text-[9.5px] font-bold uppercase cursor-pointer text-center"
                          >
                             Generate Dynamic Event
                          </button>
                        )}
                      </form>

                      <p className="text-[8.5px] text-zinc-500 leading-normal">
                        This queries the actual server-side Gemini 3.5 Flash Model using the modern SDK layout, synthesizing a custom game title, map environment lore, and ruleset.
                      </p>
                    </div>
                  )}

                </div>

                {/* Confirm footer */}
                <span className="text-[8px] text-zinc-650 font-mono tracking-widest text-center block select-none uppercase mt-auto">
                   BattleArena Sandbox DB Shell // Auth-ledger strict // Port 3000
                </span>
              </div>
            )}

          </div>

          {/* Sticky bottom navigation for SPA tabs */}
          <nav className="absolute bottom-0 inset-x-0 bg-[#0f172a] border-t border-[#1f2937] flex justify-around py-2.5 text-zinc-500 z-30 sticky backdrop-blur-md select-none mt-auto">
            <button 
              onClick={() => {
                setActiveTab('home');
                setSelectedTournamentId(null);
              }}
              className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'home' ? 'text-[#facc15] font-extrabold shadow-sm' : 'hover:text-zinc-350'}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[8.5px] mt-1 font-bold font-mono uppercase tracking-wide">Home</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('arena_list');
                setSelectedTournamentId(null);
              }}
              className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'arena_list' || activeTab === 'arena_details' ? 'text-[#facc15] font-extrabold shadow-sm' : 'hover:text-zinc-350'}`}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-[8.5px] mt-1 font-bold font-mono uppercase tracking-wide">Arena</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('leaderboard');
                setSelectedTournamentId(null);
              }}
              className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'leaderboard' ? 'text-[#facc15] font-extrabold' : 'hover:text-zinc-350'}`}
            >
              <Crown className="w-4 h-4" />
              <span className="text-[8.5px] mt-1 font-bold font-mono uppercase tracking-wide">Tiers</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('wallet');
                setSelectedTournamentId(null);
              }}
              className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'wallet' || activeTab === 'deposit' || activeTab === 'withdraw' ? 'text-[#facc15] font-extrabold shadow-sm' : 'hover:text-zinc-350'}`}
            >
              <Wallet className="w-4 h-4" />
              <span className="text-[8.5px] mt-1 font-bold font-mono uppercase tracking-wide">Ledger</span>
            </button>

            <button 
              onClick={() => {
                setActiveTab('profile');
                setSelectedTournamentId(null);
              }}
              className={`flex flex-col items-center flex-1 transition-colors py-0.5 cursor-pointer ${activeTab === 'profile' ? 'text-[#facc15] font-bold shadow-sm' : 'hover:text-zinc-350'}`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-[8.5px] mt-1 font-bold font-mono uppercase tracking-wide">Profile</span>
            </button>
          </nav>

        </div>
      )}

    </div>
  );
}
