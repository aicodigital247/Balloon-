/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tenant, User, Tournament, Team, LedgerEntry, Notification, AuditLog } from './types';
import { TENANTS, INITIAL_TOURNAMENTS, INITIAL_TEAMS } from './data';
import PhoneSimulator from './components/PhoneSimulator';

export default function App() {
  // Central State Management
  const [currentTenant, setCurrentTenant] = useState<Tenant>(TENANTS[0]); // Default: Nigeria (NGN)
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

  // Synced Immutable Ledger initialized to mimic authentic Nigeria deposit entries
  const [ledger, setLedger] = useState<LedgerEntry[]>([
    { 
      id: 1, 
      walletId: "BA-981245722-LEDG", 
      reference: "BA-LEDG-INIT-90082", 
      type: 'credit', 
      amount: 15000, 
      description: "Initial Monnify Bank Transfer Credit", 
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString() 
    },
    { 
      id: 2, 
      walletId: "BA-981245722-LEDG", 
      reference: "REG-tour_01", 
      type: 'debit', 
      amount: 1500, 
      description: "Match Entry Stake Fee: Lagos Masters Elite Purgatory", 
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
      message: "Deposit Confirmation: Credit ₦15,000 received via Monnify webhook integration.",
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

  // Telemetry Audit log triggers
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

    // Push notification (Telegram bot chat alert)
    const newNotification: Notification = {
      id: `not_${Date.now()}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      type: 'wallet',
      message: `Credit transaction received: Received ${currentTenant.currencySymbol}${amount.toLocaleString()} via instant virtual gateway.`,
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
      const randomOpponents = ["NaijaSniper", "LagosPhantom_Pro", "GoldCoastFighter", "SafariMage"];
      const opponent = randomOpponents[Math.floor(Math.random() * randomOpponents.length)];
      
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
              status: 'completed',
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
      logoUrl: ["💀", "🎭", "🗡️", "🎯", "🔥"][Math.floor(Math.random() * 5)],
      leaderId: currentUser.id,
      memberNames: ["Gladiator22", "GuestGamer_1", "GuestGamer_2"]
    };

    setTeams(prev => [...prev, newTeam]);
    pushAuditLog(
      "TEAM_CREATION", 
      `Committed new squad "${name}" on tenant ${currentTenant.id}.`,
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
              message: `🔑 ROOM KEY RELEASED: Match "${t.title}" is ready. Custom Lobby Code is ${generatedRoom}. Join queue immediately.`,
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
      scheduledTime: "18:00 Local Time"
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
  };

  const handleGenerateAITournament = async (game: string, prize: number) => {
    setIsGeneratingTournamentAI(true);
    pushAuditLog("AI_TOURNAMENT_REQ", `Invoking Gemini API on backend to draft premium tournament lore for game "${game}" with prize ₦${prize.toLocaleString()}.`);

    try {
      const response = await fetch("/api/generate-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantName: currentTenant.name,
          gameName: game,
          prizePool: `₦${prize.toLocaleString()}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        const cleanDesc = data.description || `Claim regional glory inside BattleArena ${currentTenant.name}.`;
        const uppercaseGameWord = game.toUpperCase().split(' ')[0];
        const draftTitle = `${currentTenant.country} ${uppercaseGameWord} Championship Cup`;
        
        handleAdminCreateTournament(draftTitle, game, prize / 10, prize);
        
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

  const handleTriggerLedgerAdd = (type: 'credit' | 'debit', amount: number, description: string) => {
    if (type === 'credit') {
      handleDeposit(amount, description);
    } else {
      handleWithdraw(amount);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-center items-center p-4 relative antialiased select-none font-sans overflow-y-auto">
      
      {/* Decorative Shifting Background Glow Accents */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-[#facc15]/3 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/3 blur-[160px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      {/* Main Single Column Phone Simulation Wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Upper Brand Badge bar */}
        <div className="text-center mb-6 max-w-sm">
          <h1 className="text-[17px] font-black font-display text-white uppercase tracking-wider flex items-center justify-center gap-1.5 leading-none">
            ⚡ BattleArena Guild
          </h1>
          <p className="text-[10.5px] text-zinc-500 font-mono mt-1 leading-snug">
            Immutable Ledger Stakes // Nigeria Nodes Gateways // Tele-Auth Core
          </p>
        </div>

        {/* Instantiated Mobile Simulator */}
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
          // SaaS parameters
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

        {/* Bottom Small Compliance Label */}
        <div className="text-center text-[9px] font-semibold text-zinc-650 opacity-60 font-mono tracking-widest mt-4 uppercase">
          BattleArena Tele-Auth System v2 // Node 3000 Active
        </div>

      </div>

    </div>
  );
}
