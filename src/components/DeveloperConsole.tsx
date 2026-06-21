/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, FileCode, Terminal, RefreshCw, Copy, Check, Play, Shield, 
  ArrowUpRight, ArrowDownLeft, Trash2, Send, Cpu
} from "lucide-react";
import { Tenant, User, Tournament, Team, LedgerEntry, AuditLog } from '../types';
import { ARCHITECTURE_FILES } from '../data';

interface DeveloperConsoleProps {
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  currentUser: User;
  tournaments: Tournament[];
  teams: Team[];
  ledger: LedgerEntry[];
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

export default function DeveloperConsole({
  currentTenant,
  setCurrentTenant,
  tenants,
  currentUser,
  tournaments,
  teams,
  ledger,
  auditLogs,
  onTriggerLedgerAdd,
  onRunCron,
  onClearDatabase,
  onAdminCreateTournament,
  onAdminPayoutTournament,
  onAdminReleaseRoom,
  isGeneratingTournamentAI,
  onGenerateAITournament
}: DeveloperConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'db' | 'code' | 'cron' | 'admin'>('db');
  const [selectedFile, setSelectedFile] = useState(ARCHITECTURE_FILES[0]);
  const [copiedFileIndex, setCopiedFileIndex] = useState<number | null>(null);
  
  // Custom manual ledger tool form
  const [manualType, setManualType] = useState<'credit' | 'debit'>('credit');
  const [manualAmount, setManualAmount] = useState<string>('');
  const [manualDesc, setManualDesc] = useState('');

  // Custom Admin tournament creator form
  const [adminTitle, setAdminTitle] = useState('');
  const [adminGame, setAdminGame] = useState('PUBG Mobile');
  const [adminEntry, setAdminEntry] = useState('');
  const [adminPrize, setAdminPrize] = useState('');

  // Math for ledger SUM checks
  const totalCredit = ledger.filter(l => l.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
  const totalDebit = ledger.filter(l => l.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
  const calculatedBalance = totalCredit - totalDebit;

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedFileIndex(idx);
    setTimeout(() => setCopiedFileIndex(null), 2000);
  };

  const submitManualLedger = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(manualAmount);
    if (!amountNum || amountNum <= 0 || !manualDesc) return;
    onTriggerLedgerAdd(manualType, amountNum, manualDesc);
    setManualAmount('');
    setManualDesc('');
  };

  const handleAdminCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle.trim()) return;
    const entryNum = parseFloat(adminEntry) || 0;
    const prizeNum = parseFloat(adminPrize) || entryNum * 10;
    onAdminCreateTournament(adminTitle.trim(), adminGame, entryNum, prizeNum);
    setAdminTitle('');
    setAdminEntry('');
    setAdminPrize('');
  };

  const handleAiTournamentGen = () => {
    onGenerateAITournament(adminGame, parseFloat(adminPrize) || 10000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-full overflow-hidden select-text text-slate-300 font-sans">
      
      {/* Console Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider uppercase font-mono text-cyan-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin-slow" /> BattleArena v2 Backend Sandbox
          </h2>
          <p className="text-xs text-slate-500 mt-1">Multi-tenant routing verification and mutable SQL simulated engine.</p>
        </div>

        {/* Tenant Switcher - Scopes Nigerian Naira, Ghanaian Cedis, Kenyan Shillings, South African Rands */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-semibold text-slate-400">Tenant:</span>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 shrink-0">
            {tenants.map(t => (
              <button
                key={t.id}
                onClick={() => setCurrentTenant(t)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${currentTenant.id === t.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {t.flag} <span className="hidden sm:inline ml-0.5 font-mono">{t.currency}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Menu buttons */}
      <div className="flex border-b border-slate-800 text-xs mt-4">
        <button
          onClick={() => setActiveConsoleTab('db')}
          className={`flex items-center py-2.5 px-4 font-mono font-semibold border-b-2 gap-1.5 transition ${activeConsoleTab === 'db' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MySQL Database Tables</span>
        </button>
        <button
          onClick={() => setActiveConsoleTab('admin')}
          className={`flex items-center py-2.5 px-4 font-mono font-semibold border-b-2 gap-1.5 transition ${activeConsoleTab === 'admin' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Match Control</span>
        </button>
        <button
          onClick={() => setActiveConsoleTab('code')}
          className={`flex items-center py-2.5 px-4 font-mono font-semibold border-b-2 gap-1.5 transition ${activeConsoleTab === 'code' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>PHP Code Auditor</span>
        </button>
        <button
          onClick={() => setActiveConsoleTab('cron')}
          className={`flex items-center py-2.5 px-4 font-mono font-semibold border-b-2 gap-1.5 transition ${activeConsoleTab === 'cron' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>PHP Cron Jobs & Logs</span>
        </button>
      </div>

      {/* TAB CONTENT SPACES */}
      <div className="flex-1 overflow-y-auto pt-4 min-h-0">
        
        {/* TAB 1: DATABASE TABLES VIEW */}
        {activeConsoleTab === 'db' && (
          <div className="space-y-6">
            
            {/* Live Ledger SUM formulation check */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-900/80 mb-3">
                <span className="text-[10px] text-zinc-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" /> STATED BALANCE ALGORITHM
                </span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Fintech Standard Checked</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                As detailed in the architecture requirements, BattleArena v2 is completely <span className="text-emerald-400 font-semibold">Ledger-Authoritative</span>. User balances are recalculated on every call by summing credit rows and subtracting debit rows in the database.
              </p>
              
              <div className="mt-4 bg-slate-900/90 rounded border border-slate-850 p-2 text-xs text-slate-300">
                <div className="text-cyan-400 text-[10.5px]">MySQLi Recalculation query:</div>
                <code className="text-emerald-400 block p-1 bg-slate-950 rounded mt-1 overflow-x-auto text-[11px] whitespace-pre font-bold select-all">
                  SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance FROM wallet_ledger WHERE wallet_id = 'BA-{currentUser.id}-LEDG'
                </code>
                
                <div className="grid grid-cols-4 gap-2 mt-4 text-center text-[10.5px] border-t border-slate-800/80 pt-3">
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px]">Sum Credits</span>
                    <span className="text-emerald-400 font-bold block">{currentTenant.currencySymbol}{totalCredit.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-550 pt-2 font-bold">-</div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px]">Sum Debits</span>
                    <span className="text-slate-300 font-bold block">{currentTenant.currencySymbol}{totalDebit.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[9px]">Calculated Balance</span>
                    <span className="text-emerald-400 font-bold block underline border-b border-double border-emerald-400/50">{currentTenant.currencySymbol}{calculatedBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Database SQL Tables */}
            <div className="space-y-4">
              
              {/* TABLE: wallet_ledger */}
              <div className="space-y-1">
                <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-800">
                  <span className="text-xs font-mono font-bold text-zinc-300">Live SQL table: <span className="text-cyan-400 underline uppercase">wallet_ledger</span></span>
                  <span className="text-[10px] text-slate-500 font-mono">Records: {ledger.length} row(s)</span>
                </div>
                <div className="border border-slate-800 rounded-b-lg overflow-x-auto max-h-[160px] bg-slate-955">
                  <table className="w-full text-left font-mono text-[10.5px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-855 text-zinc-400 text-[10px] uppercase font-bold">
                        <th className="p-1 px-2.5">id</th>
                        <th className="p-1">wallet_id</th>
                        <th className="p-1">reference</th>
                        <th className="p-1">type</th>
                        <th className="p-1 text-right">amount</th>
                        <th className="p-1 px-3">description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {ledger.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-900/60 transition">
                          <td className="p-1 px-2.5 text-zinc-500">{row.id}</td>
                          <td className="p-1 text-zinc-400">{row.walletId}</td>
                          <td className="p-1 text-cyan-400 truncate max-w-24 select-all" title={row.reference}>{row.reference}</td>
                          <td className="p-1">
                            <span className={`px-1 rounded text-[9px] font-bold uppercase ${row.type === 'credit' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' : 'bg-red-950 text-red-400 border border-red-900/40'}`}>
                              {row.type}
                            </span>
                          </td>
                          <td className="p-1 text-right font-bold text-slate-200">{row.amount.toLocaleString()}</td>
                          <td className="p-1 px-3 text-slate-400 truncate max-w-32" title={row.description}>{row.description}</td>
                        </tr>
                      ))}
                      {ledger.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center p-4 text-slate-650 text-xs">Table is empty. Add transactions via phone app or developer trigger below.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABLE: users */}
              <div className="space-y-1">
                <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-800">
                  <span className="text-xs font-mono font-bold text-zinc-300">Live SQL table: <span className="text-cyan-400 underline uppercase">users</span></span>
                </div>
                <div className="border border-slate-800 rounded-b-lg overflow-x-auto bg-slate-955 max-h-[100px]">
                  <table className="w-full text-left font-mono text-[10.5px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-855 text-zinc-400 text-[10px] uppercase font-bold">
                        <th className="p-1 px-2.5">id</th>
                        <th className="p-1">tenant_id</th>
                        <th className="p-1">username</th>
                        <th className="p-1">telegram_id</th>
                        <th className="p-1">referral_code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr className="hover:bg-slate-900/60">
                        <td className="p-1 px-2.5 text-zinc-500">{currentUser.id}</td>
                        <td className="p-1 text-cyan-400">{currentTenant.id}</td>
                        <td className="p-1 font-semibold text-slate-200">@{currentUser.username}</td>
                        <td className="p-1 text-slate-400">{currentUser.id}</td>
                        <td className="p-1 text-amber-500 font-bold">{currentUser.referralCode}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* SQL Injection Emulator Form directly seeding records */}
            <div className="bg-slate-95 w-full rounded-xl border border-slate-800 p-4">
              <span className="text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-widest block mb-1">Direct Mutation: Seed wallet_ledger Record</span>
              <p className="text-xs text-slate-400 leading-normal mb-3">Allows developers to instantly seed ledger transactions bypassing UI layers to watch the recalculation engine react.</p>
              
              <form onSubmit={submitManualLedger} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-[9.5px] uppercase font-mono text-zinc-400 select-none block mb-1">Sign Ledger</label>
                  <select 
                    value={manualType} 
                    onChange={e => setManualType(e.target.value as 'credit' | 'debit')}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 hover:border-slate-700 font-mono"
                  >
                    <option value="credit">Credit / Deposit (+) </option>
                    <option value="debit">Debit / Entry Fee (-) </option>
                  </select>
                </div>
                <div>
                  <label className="text-[9.5px] uppercase font-mono text-zinc-400 select-none block mb-1">Amount ({currentTenant.currency})</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="1000"
                    value={manualAmount}
                    onChange={e => setManualAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <div className="flex-1">
                    <label className="text-[9.5px] uppercase font-mono text-zinc-400 select-none block mb-1">Description</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Bonus Referral Payout Reward"
                      value={manualDesc}
                      onChange={e => setManualDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded font-mono text-xs flex items-center justify-center"
                    title="Insert Ledger Row"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Clear database action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onClearDatabase}
                className="text-xs text-slate-500 hover:text-red-400 font-mono flex items-center gap-1.5 border border-slate-800 hover:border-red-900/30 px-3 py-1.5 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Re-seed Databases (Clear logs)</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ADMIN MATCHES CONTROLS */}
        {activeConsoleTab === 'admin' && (
          <div className="space-y-6">
            
            {/* Admin Manual Match Setup and AI Gen */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-zinc-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400 animate-pulse" /> SaaS Regional Tournament Director
                </span>
                <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-500">
                  TENANT: {currentTenant.id}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1 mb-4 leading-normal">
                Create new esport tournaments on this regional tenant database. You can use standard manual parameters, or leverage the <span className="text-cyan-400 font-semibold font-mono">Gemini AI Engine</span> to draft a thematic match description automatically.
              </p>

              <form onSubmit={handleAdminCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[9.5px] uppercase font-mono text-zinc-400 block mb-1">Tournament Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Abuja Assault League: Season 4"
                      value={adminTitle}
                      onChange={e => setAdminTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9.5px] uppercase font-mono text-zinc-400 block mb-1">Select Game</label>
                    <select 
                      value={adminGame} 
                      onChange={e => setAdminGame(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none"
                    >
                      <option value="PUBG Mobile">PUBG Mobile</option>
                      <option value="Free Fire">Free Fire</option>
                      <option value="CODM">Call of Duty Mobile</option>
                      <option value="Mobile Legends">Mobile Legends</option>
                      <option value="Apex Legends">Apex Legends Mobile</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9.5px] uppercase font-mono text-zinc-400 block mb-1">Entry Stake Fee ({currentTenant.currencySymbol})</label>
                    <input 
                      type="number" 
                      required 
                      placeholder={currentTenant.entryFeeMultiplier + ""}
                      value={adminEntry}
                      onChange={e => setAdminEntry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[9.5px] uppercase font-mono text-zinc-400 block mb-1">Grand Prize Pool ({currentTenant.currencySymbol})</label>
                    <input 
                      type="number" 
                      required 
                      placeholder={currentTenant.entryFeeMultiplier * 10 + ""}
                      value={adminPrize}
                      onChange={e => setAdminPrize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-1.5 px-3 rounded text-xs font-mono"
                  >
                    Commit Manual Tournament Record
                  </button>
                  <button
                    type="button"
                    onClick={handleAiTournamentGen}
                    disabled={isGeneratingTournamentAI}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-100 font-bold py-1.5 px-3 rounded text-xs font-mono flex items-center justify-center gap-1.5 border border-violet-500"
                  >
                    <Cpu className={`w-3.5 h-3.5 ${isGeneratingTournamentAI ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingTournamentAI ? 'AI Drafting...' : 'Draft Description via Gemini AI'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Active tournament room releases & prize dispatchers */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Regional Matches Pipeline Actions</span>
              
              <div className="space-y-2">
                {tournaments.filter(t => t.tenantId === currentTenant.id).map(tour => {
                  return (
                    <div key={tour.id} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-200">{tour.title}</span>
                          <span className={`text-[9px] px-1.5 rounded ${tour.status === 'completed' ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-amber-950 text-amber-400 border border-amber-900/40'}`}>
                            {tour.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {tour.id} | Prize: {currentTenant.currencySymbol}{tour.prizePool.toLocaleString()}</p>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        {tour.status === 'upcoming' && (
                          <button
                            onClick={() => onAdminReleaseRoom(tour.id)}
                            className="flex-1 sm:flex-initial bg-cyan-900/40 hover:bg-cyan-900/70 text-cyan-400 border border-cyan-800/20 px-2.5 py-1 rounded text-[10.5px] font-mono font-bold"
                          >
                            Release Room Code
                          </button>
                        )}
                        {tour.status !== 'completed' && (
                          <button
                            onClick={() => {
                              const winner = prompt("Who won the tournament? Enter match username: ", "Gladiator22");
                              if (winner) onAdminPayoutTournament(tour.id, winner);
                            }}
                            className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-2.5 py-1 rounded text-[10.5px] font-mono font-bold"
                          >
                            Enter Results (Payout)
                          </button>
                        )}
                        {tour.status === 'completed' && (
                          <span className="text-[10px] text-emerald-400 font-bold font-mono border border-emerald-900/30 bg-emerald-950/30 px-2.5 py-1 rounded text-center block w-full">
                            Payout Released to {tour.winnerPlayerName}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {tournaments.filter(t => t.tenantId === currentTenant.id).length === 0 && (
                  <div className="text-center py-6 text-slate-600 font-mono text-[10.5px]">No active tournaments on this tenant node</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHP COMPONENT SOURCE VIEWER */}
        {activeConsoleTab === 'code' && (
          <div className="space-y-4">
            <p className="text-slate-400 text-xs leading-relaxed">
              Examine the official PHP 8.x + MySQLi code templates developed for BattleArena v2's native server architecture. These are identical to the structures described in your requested file layout:
            </p>

            {/* List selectors of PHP documents */}
            <div className="flex flex-wrap gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
              {ARCHITECTURE_FILES.map((file, idx) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`px-2 py-1 text-[10px] font-mono rounded transition flex items-center gap-1 ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <span>{file.path.split('/').pop()}</span>
                  </button>
                );
              })}
            </div>

            {/* Render selected documentation metadata */}
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1">
                <div className="text-[10px] text-cyan-400 font-mono font-bold uppercase uppercase">Location: {selectedFile.path}</div>
                <div className="text-slate-400 font-sans mt-0.5 text-[11px] leading-relaxed">{selectedFile.description}</div>
              </div>
              <button
                onClick={() => handleCopyCode(selectedFile.code, ARCHITECTURE_FILES.indexOf(selectedFile))}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded text-[10.5px] font-mono flex items-center gap-1 border border-slate-800"
              >
                {copiedFileIndex === ARCHITECTURE_FILES.indexOf(selectedFile) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Highlight Window */}
            <div className="relative rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
              <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-500">
                <span>LANGUAGE: {selectedFile.language.toUpperCase()}</span>
                <span>PHP 8.x SPECIFIED CONNECTION</span>
              </div>
              <pre className="p-4 overflow-auto text-[11px] font-mono text-cyan-300 leading-normal max-h-[300px] select-all">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: CRON CONTROLLER & LOGS TERMINAL */}
        {activeConsoleTab === 'cron' && (
          <div className="space-y-4">
            <p className="text-slate-400 text-xs">
              Execute recurring backend cron tasks. Running scripts emits actual server trace paths reflecting SQL databases updates:
            </p>

            {/* Run Buttons grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                onClick={() => onRunCron('release_rooms.php')}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-lg text-left font-mono group"
              >
                <div className="text-[10.5px] text-cyan-400 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-cyan-400 text-cyan-400 group-hover:scale-110 duration-150" /> release_rooms.php
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">Dispatches active codes</span>
              </button>

              <button
                onClick={() => onRunCron('process_wallets.php')}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-lg text-left font-mono group"
              >
                <div className="text-[10.5px] text-cyan-400 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-cyan-400 text-cyan-400 group-hover:scale-110 duration-150" /> process_wallets.php
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">Audits ledgers integrity</span>
              </button>

              <button
                onClick={() => onRunCron('update_leaderboard.php')}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-lg text-left font-mono group"
              >
                <div className="text-[10.5px] text-cyan-400 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-cyan-400 text-cyan-400 group-hover:scale-110 duration-150" /> update_leaderboard.php
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">Re-calculates rankings</span>
              </button>

              <button
                onClick={() => onRunCron('cleanup.php')}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 p-2.5 rounded-lg text-left font-mono group"
              >
                <div className="text-[10.5px] text-cyan-400 font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-cyan-400 text-cyan-400 group-hover:scale-110 duration-150" /> cleanup.php
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">Prunes transient folders</span>
              </button>
            </div>

            {/* Micro Terminal Window showing simulated outputs */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 flex flex-col h-[260px]">
              <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-cyan-400" /> BATTLEARENA TERMINAL LOGS</span>
                <span className="text-emerald-500 animate-pulse font-bold">● HOSTED ON PORT 3000</span>
              </div>
              
              {/* Terminal code lines container */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-[10.5px] text-cyan-400 space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="leading-relaxed border-b border-slate-900/60 pb-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500">[{log.timestamp}]</span>
                      <span className="text-zinc-650 bg-slate-900 px-1 py-0.2 rounded text-[8px] uppercase border border-slate-850 shrink-0 font-bold">{log.event}</span>
                    </div>
                    <p className="text-slate-300 mt-1 select-text">{log.details}</p>
                    {log.sqlQuery && (
                      <div className="mt-1 p-1 bg-slate-900/80 rounded border border-slate-850/50 text-[10px] text-emerald-400 select-all font-semibold overflow-x-auto whitespace-pre">
                        SQL &gt; {log.sqlQuery}
                      </div>
                    )}
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="text-center py-16 text-slate-705">No sandbox actions logged yet. Run crons or perform app deposits to see telemetry.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
