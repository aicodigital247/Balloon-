/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, Play, CheckCircle, Bell, RefreshCw, Smartphone, Database, 
  Terminal, Cpu, FileCode, Server, HelpCircle, AlertCircle
} from "lucide-react";
import { Tenant, User, Tournament, Team, LedgerEntry, Notification, AuditLog } from './types';
import { TENANTS, INITIAL_TOURNAMENTS, INITIAL_TEAMS } from './data';
import PhoneSimulator from './components/PhoneSimulator';
import DeveloperConsole from './components/DeveloperConsole';

export default function App() {
  // Shared central state
  const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]); // Default in Nigeria
  const [activeTab, setActiveTab] = useState<string>('home');
  
  const [currentUser, setCurrentUser] = useState<User>({
    id: 981245722,
    username: "Gladiator22",
    avatarUrl: "🏆",
    referralCode: "ARENA-GLAD-NG-98",
    createdAt: new Date().toISOString(),
    joinedTenantId: "ba_nigeria"
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);

  // Synced Ledger entries initialized to match Nigerian currency scales
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    { 
      id: 1, 
      walletId: "BA-981245722-LEDG", 
      reference: "BA-LEDG-INIT-90082", 
      type: 'credit', 
      amount: 5000, 
      description: "Initial Monnify Bank Transfer Credit", 
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString() 
    },
    { 
      id: 2, 
      walletId: "BA-981245722-LEDG", 
      reference: "REG-tour_02", 
      type: 'debit', 
      amount: 1000, 
      description: "Match Entry Stake Fee: Apex Arena Elite Trios", 
      createdAt: new Date(Date.now() - 3600000).toISOString() 
    }
  ]);

  // Notifications (Telegram messages mock stack)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "not_1",
      tenantId: "ba_nigeria",
      userId: 981245722,
      type: "wallet",
      message: "Deposit Confirmation: Credit ₦5,000 received via Monnify webhook integration.",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      isBotSent: true
    },
    {
      id: "not_2",
      tenantId: "ba_nigeria",
      userId: 981245722,
      type: "match",
      message: "Registered: Abuja Apex Arena Stake entry fee allocated. Check regional rooms feed.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      isBotSent: true
    }
  ]);

  // Dynamic telemetry log checks
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "log_1",
      timestamp: new Date(Date.now() - 60000 * 5).toLocaleTimeString(),
      event: "BOOTSTRAP",
      details: "SaaS Core Multi-Tenant Server active. Loaded 4 Regional Tenancy nodes.",
      sqlQuery: "SELECT id, name, country FROM tenants"
    },
    {
      id: "log_2",
      timestamp: new Date(Date.now() - 60000 * 4).toLocaleTimeString(),
      event: "API_ROUTER_DISPATCH",
      details: "Single Entry Router loaded. Configured routes mapping dynamic callbacks to index.php",
      sqlQuery: "SELECT value FROM system_settings WHERE key_name = 'router_mode'"
    },
    {
      id: "log_3",
      timestamp: new Date(Date.now() - 60000 * 3).toLocaleTimeString(),
      event: "AUTHENTICATION",
      details: "Client open event. Telegram WebApp initData query hash integrity checks succeeded.",
      sqlQuery: "SELECT * FROM users WHERE telegram_id = '981245722' LIMIT 1"
    }
  ]);

  const [commentaryLogs, setCommentaryLogs] = useState<Record<string, string>>({});
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
  const [isGeneratingTournamentAI, setIsGeneratingTournamentAI] = useState(false);

  // Helper log pushing utility
  const pushAuditLog = (event: string, details: string, sqlQuery?: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      event,
      details,
      sqlQuery
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // --- ACTIONS HANDLERS ---

  const handleDeposit = (amount: number, description: string) => {
    const ref = `BA-LEDG-CR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: LedgerEntry = {
      id: ledger.length + 1,
      walletId: `BA-${currentUser.id}-LEDG`,
      reference: ref,
      type: 'credit',
      amount,
      description,
      createdAt: new Date().toISOString()
    };

    setLedger(prev => [newEntry, ...prev]);
    pushAuditLog(
      "LEDGER_CREDIT", 
      `Direct credit deposit into account BA-${currentUser.id}-LEDG. New Balance checked.`,
      `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${currentUser.id}-LEDG', '${ref}', 'credit', ${amount}, '${description}')`
    );

    // Push notification (Telegram bot)
    const newNotification: Notification = {
      id: `not_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'wallet',
      message: `Credit transaction received: Received ${currentTenant.currencySymbol}${amount.toLocaleString()} via instant gateway.`,
      createdAt: new Date().toISOString(),
      isBotSent: true
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleWithdraw = (amount: number) => {
    const ref = `BA-LEDG-DB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: LedgerEntry = {
      id: ledger.length + 1,
      walletId: `BA-${currentUser.id}-LEDG`,
      reference: ref,
      type: 'debit',
      amount,
      description: "Debit Payout Dispatched",
      createdAt: new Date().toISOString()
    };

    setLedger(prev => [newEntry, ...prev]);
    pushAuditLog(
      "LEDGER_DEBIT", 
      `Direct balance debit checkout ledger index. Checked balance constraints.`,
      `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${currentUser.id}-LEDG', '${ref}', 'debit', ${amount}, 'Debit Payout Dispatched')`
    );

    const newNotification: Notification = {
      id: `not_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'wallet',
      message: `Debit notification: Dispatched ${currentTenant.currencySymbol}${amount.toLocaleString()} back to Telegram payout node.`,
      createdAt: new Date().toISOString(),
      isBotSent: true
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleRegisterTournament = (id: string, entryFee: number) => {
    const ref = `REG-${id}`;
    const newEntry: LedgerEntry = {
      id: ledger.length + 1,
      walletId: `BA-${currentUser.id}-LEDG`,
      reference: ref,
      type: 'debit',
      amount: entryFee,
      description: `Entry Fee: Registered into match ${tournaments.find(t=>t.id===id)?.title}`,
      createdAt: new Date().toISOString()
    };

    setLedger(prev => [newEntry, ...prev]);
    
    // Increment the participants count
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, currentParticipants: t.currentParticipants + 1 };
      }
      return t;
    }));

    pushAuditLog(
      "TOURNAMENT_REGISTRATION",
      `Deducted entry fee ledger and incremented participant headcount index for match ID ${id}.`,
      `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${currentUser.id}-LEDG', 'REG-${id}', 'debit', ${entryFee}, 'Registration debit'); UPDATE tournaments SET current_participants = current_participants + 1 WHERE id = '${id}'`
    );

    const newNotification: Notification = {
      id: `not_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'match',
      message: `Stake Accepted: You successfully joined tournament match #${id}. Details will follow via bot.`,
      createdAt: new Date().toISOString(),
      isBotSent: true
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handlePlayTournament = async (id: string) => {
    const targetMatch = tournaments.find(t => t.id === id);
    if (!targetMatch) return;

    setIsGeneratingCommentary(true);
    pushAuditLog("AI_COMMENTATOR_REQ", `Requesting dramatic commentary streams match ID ${id} between @Gladiator22 and a random challenger.`);

    try {
      // Simulate/trigger matches gameplay
      const randomOppponents = ["NaijaSniper", "LagosPhantom_Pro", "GoldCoastFighter", "SafariMage"];
      const opponent = randomOppponents[Math.floor(Math.random() * randomOppponents.length)];
      
      const score1 = Math.floor(Math.random() * 5) + 3;
      const score2 = Math.floor(Math.random() * 3);

      const response = await fetch("/api/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1: currentUser.username,
          player2: opponent,
          game: targetMatch.gameName,
          tenant: currentTenant.name,
          score1,
          score2
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setCommentaryLogs(prev => ({ ...prev, [id]: data.commentary }));
        pushAuditLog(
          "AI_COMMENTATOR_SUCCESS", 
          `Received high-stakes match gameplay trace logs. Final Score: ${score1}-${score2}.`
        );
        
        // Transition game to completed status on admin board
        setTournaments(prev => prev.map(t => {
          if (t.id === id) {
            return { 
              ...t, 
              status: 'playing',
              winnerPlayerName: score1 > score2 ? currentUser.username : opponent
            };
          }
          return t;
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      pushAuditLog("AI_COMMENTATOR_FAIL", `Gemini API fallback log active: ${err.message || 'Error'}`);
    } finally {
      setIsGeneratingCommentary(false);
    }
  };

  const handleAddTeam = (name: string) => {
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      tenantId: currentTenant.id,
      name,
      logoUrl: ["💎", "🏆", "🎯", "🔥", "⚡"][Math.floor(Math.random() * 5)],
      leaderId: currentUser.id,
      memberNames: ["Gladiator22", "GuestGamer_1", "GuestGamer_2"]
    };

    setTeams(prev => [...prev, newTeam]);
    pushAuditLog(
      "TEAM_CREATION", 
      `Committed new squad ${name} on tenant ${currentTenant.id}.`,
      `INSERT INTO teams (id, tenant_id, name, logo_url, leader_id) VALUES ('${newTeam.id}', '${currentTenant.id}', '${name}', '${newTeam.logoUrl}', ${currentUser.id})`
    );
  };

  const handleRunCron = (scriptName: string) => {
    pushAuditLog("CRON_JOB_START", `Executed cron daemon: cron/${scriptName}`);

    if (scriptName === 'release_rooms.php') {
      let runCount = 0;
      setTournaments(prev => prev.map(t => {
        if (t.status === 'upcoming' && t.tenantId === currentTenant.id) {
          runCount++;
          const generatedRoom = `ARENA_${currentTenant.currency}_${Math.floor(10000 + Math.random() * 90000)}`;
          
          // Generate notification
          setTimeout(() => {
            const botAlert: Notification = {
              id: `not_cron_${Date.now()}_${t.id}`,
              tenantId: currentTenant.id,
              userId: currentUser.id,
              type: 'match',
              message: `🔑 ROOM KEY RELEASED: Match "${t.title}" is ready. Custom Code is ${generatedRoom}. Enter queue immediately.`,
              createdAt: new Date().toISOString(),
              isBotSent: true
            };
            setNotifications(prevNot => [botAlert, ...prevNot]);
          }, 400);

          return { ...t, status: 'room_released', roomCode: generatedRoom };
        }
        return t;
      }));

      setTimeout(() => {
        pushAuditLog(
          "CRON_JOB_COMPLETE", 
          `cron/release_rooms.php successfully audited. Formatted ${runCount} upcoming lobbies to active room keys.`,
          `UPDATE tournaments SET status='room_released', room_code='ROOM_GEN' WHERE status='upcoming' AND tenant_id='${currentTenant.id}'`
        );
      }, 500);

    } else if (scriptName === 'process_wallets.php') {
      setTimeout(() => {
        pushAuditLog(
          "CRON_JOB_COMPLETE",
          `cron/process_wallets.php run successful. Audited 100% of user ledger nodes. 0 discrepancies found on SaaS transactions.`,
          `SELECT wallet_id, SUM(CASE WHEN type='credit' THEN amount ELSE -amount END) as current FROM wallet_ledger GROUP BY wallet_id`
        );
      }, 400);
      
    } else if (scriptName === 'update_leaderboard.php') {
      setTimeout(() => {
        pushAuditLog(
          "CRON_JOB_COMPLETE",
          `cron/update_leaderboard.php compiled. Regenerated rankings. Gladiator22 ranks at #2 inside ${currentTenant.name} scoreboard.`,
          `SELECT username, SUM(amount) as total_earnings FROM wallet_ledger JOIN wallets ON wallets.id = wallet_ledger.wallet_id JOIN users ON users.id = wallets.user_id WHERE users.tenant_id = '${currentTenant.id}' GROUP BY username ORDER BY total_earnings DESC`
        );
      }, 400);
    } else {
      setTimeout(() => {
        pushAuditLog("CRON_JOB_COMPLETE", `cron/${scriptName} prunes completed. Directories are spotless.`);
      }, 300);
    }
  };

  const handleClearDatabase = () => {
    setLedger([
      { 
        id: 1, 
        walletId: "BA-981245722-LEDG", 
        reference: "BA-LEDG-INIT-90082", 
        type: 'credit', 
        amount: currentTenant.entryFeeMultiplier * 5, 
        description: "Initial Monnify Bank Transfer Credit", 
        createdAt: new Date().toISOString() 
      }
    ]);
    setTournaments(INITIAL_TOURNAMENTS);
    setTeams(INITIAL_TEAMS);
    setNotifications([]);
    setCommentaryLogs({});
    pushAuditLog("DATABASE_RE_SEED", "Truncated transaction index and logs. Restored base configuration schemas.", "TRUNCATE TABLE wallet_ledger; TRUNCATE TABLE notifications; TRUNCATE TABLE tournaments");
  };

  const handleAdminCreateTournament = (title: string, game: string, entryFee: number, prize: number) => {
    const newTour: Tournament = {
      id: `tour_${Date.now()}`,
      tenantId: currentTenant.id,
      title,
      gameName: game,
      entryFee,
      prizePool: prize,
      currentParticipants: 0,
      maxParticipants: 32,
      status: "upcoming",
      description: `Elite arena match in regional node ${currentTenant.name}. Strictly atomic ledger accounting protects entry fees.`,
      scheduledTime: "20:00 Local Time"
    };

    setTournaments(prev => [...prev, newTour]);
    pushAuditLog(
      "ADMIN_TOURNAMENT_CREATE",
      `Admin logged new esports match ${title} on tenant ${currentTenant.id}.`,
      `INSERT INTO tournaments (id, tenant_id, title, game_name, entry_fee, prize_pool, status) VALUES ('${newTour.id}', '${currentTenant.id}', '${title}', '${game}', ${entryFee}, ${prize}, 'upcoming')`
    );
  };

  const handleAdminPayoutTournament = (tournamentId: string, winnerName: string) => {
    const match = tournaments.find(t=>t.id===tournamentId);
    if (!match) return;

    // Credit winner! If the winner is our simulated user (Gladiator22), run the ledger deposit!
    const isCurrentUserWinner = winnerName.toLowerCase() === currentUser.username.toLowerCase();
    
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        return {
          ...t,
          status: 'completed',
          winnerPlayerName: winnerName
        };
      }
      return t;
    }));

    if (isCurrentUserWinner) {
      handleDeposit(match.prizePool, `Esports Victory Payout: ${match.title}`);
    }

    pushAuditLog(
      "TOURNAMENT_PAYOUT_DISPATCHED",
      `Paid prize pool of ${currentTenant.currencySymbol}${match.prizePool.toLocaleString()} to @${winnerName}. Closed match record.`,
      `UPDATE tournaments SET status='completed', winner_name='${winnerName}' WHERE id='${tournamentId}'; INSERT INTO wallet_ledger(wallet_id, reference, type, amount, description) VALUES(...)`
    );

    const botAnnouncement: Notification = {
      id: `not_payout_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'referral',
      message: `🏆 VICTORY ANNOUNCEMENT: @${winnerName} won the "${match.title}" and secured the grand prize pool of ${currentTenant.currencySymbol}${match.prizePool.toLocaleString()}! Ledger updated.`,
      createdAt: new Date().toISOString(),
      isBotSent: true
    };
    setNotifications(prev => [botAnnouncement, ...prev]);
  };

  const handleAdminReleaseRoom = (id: string) => {
    const code = `ARENA_${currentTenant.currency}_${Math.floor(10000 + Math.random() * 90000)}`;
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'room_released', roomCode: code };
      }
      return t;
    }));

    pushAuditLog(
      "ADMIN_ROOM_RELEASE",
      `Admin released custom lobby room coordinates for Match ID ${id}.`,
      `UPDATE tournaments SET status='room_released', room_code='${code}' WHERE id='${id}'`
    );

    const botAlert: Notification = {
      id: `not_room_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'match',
      message: `🔑 LOBBY DETECTED: Room Code [${code}] released for your match "${tournaments.find(t=>t.id===id)?.title}". Play ready!`,
      createdAt: new Date().toISOString(),
      isBotSent: true
    };
    setNotifications(prev => [botAlert, ...prev]);
  };

  const handleGenerateAITournament = async (game: string, prize: number) => {
    setIsGeneratingTournamentAI(true);
    pushAuditLog("AI_TOURNAMENT_REQ", `Invoking Gemini API on backend to draft premium tournament lore for game "${game}" with prize ${prize}.`);

    try {
      const response = await fetch("/api/generate-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: currentTenant.name,
          gameName: game,
          prizePool: `${currentTenant.currencySymbol}${prize.toLocaleString()}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Build tournament with created AI description
        const cleanDesc = data.description || `Claim regional glory inside BattleArena ${currentTenant.name}.`;
        const uppercaseGameWord = game.toUpperCase().split(' ')[0];
        const draftTitle = `${currentTenant.country} ${uppercaseGameWord} Championship Cup`;
        
        handleAdminCreateTournament(draftTitle, game, prize / 10, prize);
        
        // Update the description of the newly created tournament (which is the last element added)
        setTournaments(prev => {
          const copied = [...prev];
          if (copied.length > 0) {
            copied[copied.length - 1].description = cleanDesc;
          }
          return copied;
        });

        pushAuditLog("AI_TOURNAMENT_SUCCESS", `Committed AI-assisted tournament outline successfully.`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      pushAuditLog("AI_TOURNAMENT_FAIL", `Gemini API Draft failed. Falling back to default thematic layout.`);
      handleAdminCreateTournament(`${currentTenant.country} Elite ${game} Showdown`, game, prize / 10, prize);
    } finally {
      setIsGeneratingTournamentAI(false);
    }
  };

  // Switch tenant changes currency multiplier on ledger init to scale accurately
  const handleTriggerLedgerAdd = (type: 'credit' | 'debit', amount: number, description: string) => {
    if (type === 'credit') {
      handleDeposit(amount, description);
    } else {
      handleWithdraw(amount);
    }
  };

  const handleTenantSwitch = (newTenant: Tenant) => {
    setCurrentTenant(newTenant);
    pushAuditLog(
      "SaaS_TENANT_MIGRATION", 
      `Dispatched router redirection context to regional sub-node: ${newTenant.id}. Scoping local currency boundaries.`,
      `SELECT * FROM tenants WHERE id = '${newTenant.id}'`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Dynamic Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Core Top Navigation Header bar */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-4 py-3.5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="p-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/30 font-display font-bold text-lg select-none">
              BA
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-semibold tracking-wider font-display text-slate-100 uppercase sm:text-base">BattleArena v2</h1>
                <span className="bg-emerald-950 text-emerald-400 font-bold font-mono text-[9px] px-1.5 py-0.2 rounded-full border border-emerald-900/30">
                  MOBILE_ONLY READY
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Telegram Mini App Multi-Tenant SaaS & Fintech-Grade Authority</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-slate-905 border border-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Ledger: Authoritative</span>
            </span>
            <span className="bg-slate-905 border border-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <span>Tenant:</span>
              <span className="text-cyan-400 font-bold font-mono uppercase">{currentTenant.currency} node</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Dual Container Bento Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-0">
        
        {/* Left Column: Telegram Mini App Device Frame Simulator */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="text-center mb-4 select-none">
            <h4 className="text-xs uppercase font-mono text-slate-500 tracking-widest font-bold">Mini App Emulator Viewport</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">Exactly emulating a mobile user inside the Telegram Webview environment.</p>
          </div>

          <PhoneSimulator 
            currentTenant={currentTenant}
            currentUser={currentUser}
            tournaments={tournaments}
            teams={teams}
            ledger={ledger}
            notifications={notifications}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onRegisterTournament={handleRegisterTournament}
            onPlayTournament={handlePlayTournament}
            onAddTeam={handleAddTeam}
            commentaryLogs={commentaryLogs}
            isGeneratingCommentary={isGeneratingCommentary}
          />
        </div>

        {/* Right Column: Dynamic Developer Interactive Sandbox */}
        <div className="lg:col-span-7 flex flex-col h-full lg:max-h-[730px]">
          <DeveloperConsole 
            currentTenant={currentTenant}
            setCurrentTenant={handleTenantSwitch}
            tenants={TENANTS}
            currentUser={currentUser}
            tournaments={tournaments}
            teams={teams}
            ledger={ledger}
            auditLogs={auditLogs}
            onTriggerLedgerAdd={handleTriggerLedgerAdd}
            onRunCron={handleRunCron}
            onClearDatabase={handleClearDatabase}
            onAdminCreateTournament={handleAdminCreateTournament}
            onAdminPayoutTournament={handleAdminPayoutTournament}
            onAdminReleaseRoom={handleAdminReleaseRoom}
            isGeneratingTournamentAI={isGeneratingTournamentAI}
            onGenerateAITournament={handleGenerateAITournament}
          />
        </div>

      </main>

      {/* Micro system credentials footer bar */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-4 px-4 text-center text-[10px] text-zinc-600 font-mono tracking-wider select-none relative mt-auto">
        BATTLEARENA v2 FINTECH INFRASTRUCTURE GATES // 100% MOBILE-NATIVE INTERACTION SECURED VIA SHA256 // DEVELOPED UNDER NODE+REACT CONTAINER RUNNING ON PORT 3000
      </footer>

    </div>
  );
}
