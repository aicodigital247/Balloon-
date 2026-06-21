<?php
/**
 * BattleArena Public Folder Entry - High-Performance SaaS Frontend SPA
 * Dual-Mode: Decoupled client-side SPA with real-time PHP API bridge fallback.
 * Designed for Nigeria and multi-tenant expansion.
 */

declare(strict_types=1);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH));

// Serve static assets natively if they exist in the public directory
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; 
}

// Redirect API routes to the unified PHP backend router bootstrap
if (strpos($uri, '/api/') === 0) {
    require_once __DIR__ . '/../index.php';
    exit;
}

// Otherwise, parse and serve the ultimate high-fidelity Telegram Mini App UI!
?>
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>BattleArena - Free Fire Tournament Mini App</title>
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        slate: {
                            950: '#020617',
                            900: '#0f172a',
                            800: '#1e293b',
                            700: '#334155',
                        },
                        gold: {
                            400: '#fde047',
                            500: '#facc15',
                            600: '#eab308',
                        },
                        success: {
                            glow: '#22c55e'
                        },
                        danger: {
                            glow: '#ef4444'
                        }
                    }
                }
            }
        }
    </script>
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
        }

        .font-mono {
            font-family: 'JetBrains Mono', monospace;
        }

        /* Ambient glowing highlights */
        .neon-glow-gold {
            box-shadow: 0 0 15px rgba(250, 204, 21, 0.2);
        }
        .neon-border-gold {
            border-color: rgba(250, 204, 21, 0.4);
        }
        .neon-text-gold {
            text-shadow: 0 0 8px rgba(250, 204, 21, 0.3);
        }
        
        /* Custom scrollbar customisations */
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: #020617;
        }
        ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 99px;
        }

        /* Custom frame design wrapper */
        .mobile-frame {
            max-width: 420px;
            height: 840px;
            margin: 0 auto;
            position: relative;
            background: #000;
            border: 12px solid #1e293b;
            border-radius: 48px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }

        .mobile-notch {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 140px;
            height: 24px;
            background: #1e293b;
            border-bottom-left-radius: 18px;
            border-bottom-right-radius: 18px;
            z-index: 50;
        }
    </style>
</head>
<body class="bg-[#02040a] text-slate-100 flex flex-col items-center justify-center min-h-screen p-0 sm:p-4">

    <!-- Web App Main container simulating simulated mobile constraint if viewed from Desktop -->
    <div class="w-full sm:mobile-frame flex flex-col bg-slate-950 relative h-screen sm:h-[820px] overflow-hidden">
        
        <!-- Smartphone status indicators inside notch area -->
        <div class="hidden sm:block mobile-notch flex items-center justify-center">
            <div class="w-12 h-1 bg-black/60 rounded-full mb-1"></div>
        </div>

        <!-- Custom Telegram WebApp Simulated Header Bar -->
        <div class="bg-slate-900 border-b border-slate-800 px-4 pt-4 sm:pt-7 pb-2.5 flex items-center justify-between text-xs z-30 select-none">
            <div class="flex items-center space-x-2">
                <span class="h-2.5 w-2.5 rounded-full bg-gold-500 animate-pulse"></span>
                <span class="font-mono text-slate-400 font-semibold tracking-wider text-[9px] uppercase">TG_WEBAPP:CONNECT</span>
            </div>
            <div class="flex items-center space-x-2">
                <span id="tenant-flag" class="px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-gold-500 font-mono border border-slate-800 font-bold">🇳🇬 NGN</span>
                <span class="font-bold text-slate-300 font-mono text-[10px]">BATTLEARENA</span>
            </div>
        </div>

        <!-- Region Selector Bar (Multi-tenant SaaS Switcher) -->
        <div class="bg-slate-900/90 border-b border-slate-800/60 px-3 py-1.5 flex items-center justify-between text-xs z-30 select-none backdrop-blur-md">
            <div class="flex items-center space-x-1.5 text-slate-400">
                <i data-lucide="globe" class="w-3.5 h-3.5 text-gold-500"></i>
                <span class="text-[10px] uppercase font-mono tracking-wider">Tenant Node:</span>
            </div>
            <div class="relative">
                <select id="tenant-select" onchange="App.switchTenant(this.value)" class="bg-slate-950 text-slate-200 border border-slate-800 rounded px-2 py-0.5 font-mono text-[10px] focus:outline-none focus:border-gold-500 text-right">
                    <option value="ba_nigeria" selected>🇳🇬 Nigeria Sandbox</option>
                    <option value="ba_ghana">🇬🇭 Ghana Sandbox</option>
                    <option value="ba_kenya">🇰🇪 Kenya Sandbox</option>
                    <option value="ba_south_africa">🇿🇦 South Africa Sandbox</option>
                </select>
            </div>
        </div>

        <!-- APP SCREENS CONTAINER (All screens injected here) -->
        <div id="app" class="flex-1 overflow-y-auto content-container pb-24 relative z-10">
            <!-- Dynamic inject layout screen space -->
        </div>

        <!-- TOAST INSTANT ALERTS OVERLAY -->
        <div id="toast-container" class="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none space-y-2 flex flex-col items-center">
            <!-- Toast components slide-in dynamically -->
        </div>

        <!-- STICKY BOTTOM NAVIGATION BAR -->
        <nav id="bottom-nav" class="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800/90 py-3 px-2 flex items-center justify-around z-40 backdrop-blur-md select-none">
            <button onclick="App.navigateTo('home')" id="nav-home" class="nav-btn flex flex-col items-center justify-center text-gold-500 transition-all duration-200">
                <i data-lucide="home" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Home</span>
            </button>
            <button onclick="App.navigateTo('tournaments')" id="nav-tournaments" class="nav-btn flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-200">
                <i data-lucide="trophy" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Tournaments</span>
            </button>
            <button onclick="App.navigateTo('teams')" id="nav-teams" class="nav-btn flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-200">
                <i data-lucide="users" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Teams</span>
            </button>
            <button onclick="App.navigateTo('wallet')" id="nav-wallet" class="nav-btn flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-200 relative">
                <i data-lucide="wallet" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Wallet</span>
                <span id="nav-wallet-dot" class="absolute top-1 right-2.5 w-1.5 h-1.5 bg-success-glow rounded-full hidden"></span>
            </button>
            <button onclick="App.navigateTo('leaderboard')" id="nav-leaderboard" class="nav-btn flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-200">
                <i data-lucide="crown" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Rankings</span>
            </button>
            <button onclick="App.navigateTo('profile')" id="nav-profile" class="nav-btn flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-200">
                <i data-lucide="user" class="w-5 h-5 mb-1 text-inherit"></i>
                <span class="text-[9px] font-medium tracking-wide">Profile</span>
            </button>
        </nav>

        <!-- FLOATING REAL-TIME BACKEND API & SQL LOGS DRAWER -->
        <div id="logs-drawer" class="absolute bottom-0 left-0 right-0 bg-slate-950 border-t-2 border-gold-500/50 z-50 h-[38%] transition-all duration-300 transform translate-y-[90%] flex flex-col select-none">
            <div onclick="App.toggleLogsDrawer()" class="bg-slate-900 px-4 py-2 flex items-center justify-between cursor-pointer border-b border-slate-800">
                <div class="flex items-center space-x-2 text-xs text-slate-300 font-mono">
                    <i data-lucide="terminal" class="w-4 h-4 text-gold-500"></i>
                    <span>💻 PHP API & SQL Ledger Console</span>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="text-[9px] bg-gold-500/10 text-gold-500 px-1.5 py-0.5 rounded border border-gold-500/30 uppercase font-mono">SaaS Live DB</span>
                    <i data-lucide="chevron-up" id="drawer-chevron" class="w-4 h-4 text-slate-400 transition-transform duration-200"></i>
                </div>
            </div>
            <div id="logs-content" class="flex-1 p-3 overflow-y-auto font-mono text-[10px] space-y-2 bg-[#020408] text-slate-300">
                <div class="text-[#00ff88]/90 font-semibold">[BOOTSTRAP] Multi-Tenant Router successfully online. Sandbox tenants loaded.</div>
                <div class="text-[#8892b0] font-mono">[SQL] SELECT * FROM tenants ORDER BY entry_multiplier DESC;</div>
            </div>
        </div>

    </div>

    <!-- MODALS AT GROUND LAYER -->
    <div id="global-modal" class="hidden absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <!-- Dynamic Modal Box Content goes here -->
    </div>

    <script>
        // Setup initial databases in localStorage to preserve ledger entries, joined states, custom teams.
        const DEFAULT_STATE = {
            tenants: {
                ba_nigeria: { id: "ba_nigeria", name: "Nigeria Branch Office", flag: "🇳🇬", currency: "NGN", symbol: "₦", mult: 1.0 },
                ba_ghana: { id: "ba_ghana", name: "Ghana Branch Office", flag: "🇬🇭", currency: "GHS", symbol: "₵", mult: 0.1 },
                ba_kenya: { id: "ba_kenya", name: "Kenya Branch Office", flag: "🇰🇪", currency: "KES", symbol: "Ksh", mult: 0.2 },
                ba_south_africa: { id: "ba_south_africa", name: "South Africa Branch Office", flag: "🇿🇦", currency: "ZAR", symbol: "R", mult: 0.5 }
            },
            currentTenantId: "ba_nigeria",
            user: {
                id: 981245722,
                username: "ApexGladiator",
                referralCode: "ARENA-APEX-NG-98",
                referredBy: null,
                avatar: "🏆",
                matchesPlayed: 42,
                wins: 15,
                kills: 189
            },
            teams: [
                { id: "tm_01", tenantId: "ba_nigeria", name: "Cyber Wolves NG", leader: "CyberMax", wins: 72, members: ["CyberMax", "Gladiatorx", "KillaB", "FF_Alpha"] },
                { id: "tm_02", tenantId: "ba_nigeria", name: "Viper Esports NGN", leader: "ViperKing", wins: 54, members: ["ViperKing", "Zero_Kill", "SniperG", "Shadow7"] },
                { id: "tm_03", tenantId: "ba_ghana", name: "Accra Avengers", leader: "Kofi_Strike", wins: 41, members: ["Kofi_Strike", "GamerGhana", "TeflonG", "V_Bullet"] },
                { id: "tm_04", tenantId: "ba_kenya", name: "Nairobi Predators", leader: "MwangiBoss", wins: 63, members: ["MwangiBoss", "OnyangoD", "Safaristar", "FF_Ken"] }
            ],
            ledger: [
                { id: 1, walletId: "BA-981245722-LEDG", reference: "INIT-DEP-MONNIFY-3312", type: "credit", amount: 7500.0, desc: "Monnify Instant Virtual Bank Transfer Funding", date: "2026-06-21 02:10:22" },
                { id: 2, walletId: "BA-981245722-LEDG", reference: "REG-STAKE-TOUR-01", type: "debit", amount: 1500.0, desc: "Tournament Allocation stake - Free Fire Solo Bermuda", date: "2026-06-21 02:45:00" }
            ],
            tournaments: [
                { id: "tour_01", tenantId: "ba_nigeria", name: "Lagos Free Fire Showdown", entryFee: 1500.0, prizePool: 50000.0, max: 100, current: 89, status: "upcoming", time: "Starts Today @ 18:00 UTC", mode: "Solo", map: "Bermuda" },
                { id: "tour_02", tenantId: "ba_nigeria", name: "Naira Elite Blitz Cup", entryFee: 3000.0, prizePool: 120000.0, max: 50, current: 48, status: "upcoming", time: "Starts Tomorrow @ 15:30 UTC", mode: "Squads (4v4)", map: "Purgatory" },
                { id: "tour_03", tenantId: "ba_nigeria", name: "Abuja Battle Royale Pro", entryFee: 1000.0, prizePool: 35000.0, max: 100, current: 100, status: "full", time: "Scheduled Today @ 19:45 UTC", mode: "Duo Match", map: "Bermuda" },
                { id: "tour_04", tenantId: "ba_ghana", name: "Accra Free Fire Glory League", entryFee: 50.0, prizePool: 2000.0, max: 50, current: 12, status: "upcoming", time: "Saturday @ 14:00 GMT", mode: "Solo", map: "Kalahari" },
                { id: "tour_05", tenantId: "ba_kenya", name: "Kenya Savannah Royale Stakes", entryFee: 200.0, prizePool: 8000.0, max: 100, current: 35, status: "upcoming", time: "Sunday @ 16:30 EAT", mode: "Squads", map: "Bermuda" }
            ]
        };

        // Cache state initialization
        let state = JSON.parse(localStorage.getItem('battlearena_v2_state')) || DEFAULT_STATE;

        const saveState = () => {
            localStorage.setItem('battlearena_v2_state', JSON.stringify(state));
        };

        // State selector properties
        const getTenantObj = () => state.tenants[state.currentTenantId];
        
        const getComputedBalance = () => {
            let balance = 0;
            state.ledger.forEach(txn => {
                if(txn.type === 'credit') {
                    balance += txn.amount;
                } else if(txn.type === 'debit') {
                    balance -= txn.amount;
                }
            });
            return balance;
        };

        // Standard App framework navigation switcher
        const App = {
            activeSection: 'splash',
            isLogsOpen: false,

            init() {
                this.log('BOOTSTRAP', 'Single Page Application loaded into /index.php', 'SELECT value FROM system_settings WHERE key_name="spa_enabled";');
                this.log('TENANCY', 'Active regional multi-tenant: ' + getTenantObj().name, 'SELECT * FROM tenants WHERE id="' + state.currentTenantId + '";');
                
                // Set initial select option UI match
                document.getElementById('tenant-select').value = state.currentTenantId;
                
                // Show Splash screen and auto clear
                this.renderSplashScreen();
                
                setTimeout(() => {
                    this.navigateTo('home');
                    lucide.createIcons();
                }, 2000);
            },

            log(event, details, sql) {
                const logsContent = document.getElementById('logs-content');
                if(!logsContent) return;
                
                const timestamp = new Date().toLocaleTimeString();
                const logEl = document.createElement('div');
                logEl.className = "border-b border-slate-900 pb-1.5 space-y-0.5 animate-fadeIn";
                
                let markup = `<div class="flex items-center justify-between">
                    <span class="text-gold-500 font-bold">[${timestamp}] ${event}</span>
                    <span class="text-slate-500 font-mono text-[9px]">API BRIDGE</span>
                </div>
                <div class="text-slate-300">${details}</div>`;

                if(sql) {
                    markup += `<div class="text-[#00ffff]/80 font-mono text-[9px] mt-0.5">${sql}</div>`;
                }

                logEl.innerHTML = markup;
                logsContent.insertBefore(logEl, logsContent.firstChild);
            },

            toggleLogsDrawer() {
                const drawer = document.getElementById('logs-drawer');
                const chevron = document.getElementById('drawer-chevron');
                this.isLogsOpen = !this.isLogsOpen;
                if(this.isLogsOpen) {
                    drawer.style.transform = "translateY(0%)";
                    chevron.style.transform = "rotate(180deg)";
                } else {
                    drawer.style.transform = "translateY(90%)";
                    chevron.style.transform = "rotate(0deg)";
                }
            },

            switchTenant(tenantId) {
                state.currentTenantId = tenantId;
                saveState();
                
                const tenant = getTenantObj();
                document.getElementById('tenant-flag').innerText = `${tenant.flag} ${tenant.currency}`;
                
                this.showToast(`Switched regional office to ${tenant.name}`, "info");
                this.log('SAAS_MULTI_TENANT', `Tenant scoped region hot-swapped to ${tenant.name}. Encapsulated database scopes applied automatically.`, `USE tenants; SELECT * FROM settings WHERE tenant_id = "${tenantId}";`);
                
                // Re-render current page
                this.navigateTo(this.activeSection);
            },

            showToast(message, type = 'success') {
                const colors = {
                    success: 'bg-[#0f1d15] border-success-glow/50 text-[#00ff88]',
                    error: 'bg-[#250f14] border-danger-glow/50 text-[#ff4466]',
                    info: 'bg-slate-900 border-slate-700 text-slate-100',
                    gold: 'bg-slate-950 border-gold-500 text-gold-500'
                };
                const toast = document.createElement('div');
                toast.className = `px-4 py-2.5 rounded-lg border text-xs font-semibold shadow-lg ${colors[type]} flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0 w-full animate-fadeIn`;
                
                let iconName = 'info';
                if(type === 'success') iconName = 'check-circle';
                if(type === 'error') iconName = 'alert-triangle';
                if(type === 'gold') iconName = 'award';

                toast.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4 text-inherit flex-shrink-0"></i><span>${message}</span>`;
                
                const container = document.getElementById('toast-container');
                container.appendChild(toast);
                lucide.createIcons();

                setTimeout(() => {
                    toast.classList.remove('opacity-0', 'translate-y-3');
                    toast.classList.add('opacity-100', 'translate-y-0');
                }, 50);

                setTimeout(() => {
                    toast.classList.add('opacity-0', 'translate-y-[-10px]');
                    setTimeout(() => toast.remove(), 300);
                }, 3500);
            },

            navigateTo(section) {
                this.activeSection = section;

                // Sync bottom navigations active color rules
                const navButtons = document.querySelectorAll('.nav-btn');
                navButtons.forEach(btn => {
                    btn.classList.add('text-slate-400');
                    btn.classList.remove('text-gold-500');
                });

                const activeNavBtn = document.getElementById(`nav-${section}`);
                if (activeNavBtn) {
                    activeNavBtn.classList.remove('text-slate-400');
                    activeNavBtn.classList.add('text-gold-500');
                    activeNavBtn.classList.add('neon-text-gold');
                }

                // Call appropriate screen renderer
                const appContainer = document.getElementById('app');
                appContainer.innerHTML = ''; // wipe former layouts

                this.log('ROUTER_DISPATCH', `Dispatched screen endpoint state matches: [/${section}]`, `GET /api/public/${section}.php`);

                if (section === 'home') this.renderHome(appContainer);
                else if (section === 'tournaments') this.renderTournaments(appContainer);
                else if (section === 'teams') this.renderTeams(appContainer);
                else if (section === 'wallet') this.renderWallet(appContainer);
                else if (section === 'leaderboard') this.renderLeaderboard(appContainer);
                else if (section === 'profile') this.renderProfile(appContainer);
                else if (section === 'deposit') this.renderDeposit(appContainer);
                else if (section === 'withdraw') this.renderWithdraw(appContainer);
                else if (section.startsWith('tournament_detail_')) {
                    const id = section.replace('tournament_detail_', '');
                    this.renderTournamentDetails(appContainer, id);
                }

                lucide.createIcons();
            },

            renderSplashScreen() {
                const app = document.getElementById('app');
                document.getElementById('bottom-nav').style.display = 'none';
                
                app.innerHTML = `
                    <div id="splash-layer" class="absolute inset-0 flex flex-col items-center justify-center bg-[#02050e] z-50 text-center animate-fadeIn p-6">
                        <div class="relative w-28 h-28 mb-4 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-full border-4 border-gold-500/20 border-t-gold-500 animate-spin"></div>
                            <div class="w-20 h-20 bg-slate-900 border-2 border-gold-500 rounded-full flex items-center justify-center shadow-lg neon-glow-gold">
                                <i data-lucide="crosshair" class="w-10 h-10 text-gold-500"></i>
                            </div>
                        </div>
                        <h1 class="text-xl font-black uppercase tracking-widest text-gold-500">BATTLEARENA</h1>
                        <p class="text-[10px] text-slate-400 font-mono mt-1 select-none">FREE FIRE TOURNAMENT NETWORK</p>
                        
                        <div class="w-48 bg-slate-900 h-1.5 rounded-full mt-6 overflow-hidden border border-slate-800">
                            <div class="bg-gold-500 h-full animate-[progress_2s_ease-i-out_infinite]" style="width: 75%; animation: pulse 1.5s infinite;"></div>
                        </div>
                        <span class="text-[10px] text-gold-500 font-mono mt-2 animate-pulse">Initializing financial state tunnels...</span>
                    </div>
                `;
            },

            renderHome(container) {
                document.getElementById('bottom-nav').style.display = 'flex';
                const tenant = getTenantObj();
                const bal = getComputedBalance();

                // Build tournaments listings
                const regionTours = state.tournaments.filter(t => t.tenantId === state.currentTenantId);
                let toursHtml = '';
                regionTours.slice(0, 2).forEach(t => {
                    toursHtml += `
                        <div class="bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <span class="w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
                                    <h4 class="text-xs font-bold text-slate-100 truncate">${t.name}</h4>
                                </div>
                                <div class="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5 font-mono">
                                    <span>Pool: ${tenant.symbol}${t.prizePool.toLocaleString()}</span>
                                    <span>Stake: ${tenant.symbol}${t.entryFee.toLocaleString()}</span>
                                </div>
                            </div>
                            <button onclick="App.navigateTo('tournament_detail_${t.id}')" class="bg-gold-500 hover:bg-gold-600 text-slate-950 font-bold text-[10px] px-3 py-1.5 rounded-md uppercase tracking-wider shadow">View</button>
                        </div>
                    `;
                });

                if(regionTours.length === 0) {
                    toursHtml = `<div class="text-center py-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-500 text-[10px] font-mono">No active regional tournaments logged for this tenancy node.</div>`;
                }

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <!-- Top balance banner -->
                        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-black p-4 border border-slate-800 shadow-2xl">
                            <div class="absolute right-[-20px] bottom-[-20px] h-28 w-28 rounded-full bg-gold-500/10 blur-xl"></div>
                            
                            <div class="flex items-center justify-between mb-4">
                                <div class="flex items-center space-x-2.5">
                                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                        <span class="text-sm">🏆</span>
                                    </div>
                                    <div>
                                        <h3 class="text-xs font-bold text-slate-100 flex items-center gap-1">@${state.user.username} <i data-lucide="check-circle-2" class="w-3.5 h-3.5 fill-gold-500 text-slate-950"></i></h3>
                                        <p class="text-[9px] text-slate-400 font-mono">TG_ID: ${state.user.id}</p>
                                    </div>
                                </div>
                                <span class="bg-slate-950 border border-slate-800 text-[9px] text-slate-400 px-2 py-0.5 rounded font-mono">Live Session</span>
                            </div>

                            <div class="space-y-1">
                                <span class="text-[9px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
                                    <i data-lucide="wallet" class="w-3 h-3 text-gold-500"></i> Calculated Local Balance
                                </span>
                                <div class="flex items-baseline space-x-1">
                                    <span class="text-2xl font-black text-slate-100">${tenant.symbol}${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    <span class="text-xs font-bold text-gold-500 font-mono uppercase">${tenant.currency}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick actions dashboard grids -->
                        <div class="grid grid-cols-4 gap-2">
                            <button onclick="App.navigateTo('deposit')" class="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:border-gold-500 px-2 py-2.5 rounded-xl transition-all">
                                <div class="w-8 h-8 rounded-full bg-success-glow/10 flex items-center justify-center text-success-glow mb-1">
                                    <i data-lucide="arrow-down-left" class="w-4.5 h-4.5"></i>
                                </div>
                                <span class="text-[9px] font-bold text-slate-200">Load</span>
                            </button>
                            <button onclick="App.navigateTo('withdraw')" class="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:border-gold-500 px-2 py-2.5 rounded-xl transition-all">
                                <div class="w-8 h-8 rounded-full bg-danger-glow/10 flex items-center justify-center text-danger-glow mb-1">
                                    <i data-lucide="arrow-up-right" class="w-4.5 h-4.5"></i>
                                </div>
                                <span class="text-[9px] font-bold text-slate-200">Payout</span>
                            </button>
                            <button onclick="App.navigateTo('tournaments')" class="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:border-gold-500 px-2 py-2.5 rounded-xl transition-all">
                                <div class="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 mb-1">
                                    <i data-lucide="swords" class="w-4.5 h-4.5"></i>
                                </div>
                                <span class="text-[9px] font-bold text-slate-200">Join Duels</span>
                            </button>
                            <button onclick="App.navigateTo('teams')" class="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 hover:border-gold-500 px-2 py-2.5 rounded-xl transition-all">
                                <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-1">
                                    <i data-lucide="users" class="w-4.5 h-4.5"></i>
                                </div>
                                <span class="text-[9px] font-bold text-slate-200">My Clan</span>
                            </button>
                        </div>

                        <!-- Esports Carousel Section -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xs font-black uppercase text-gold-500 tracking-wider">🔥 Regional Tournament stakes</h3>
                                <button onclick="App.navigateTo('tournaments')" class="text-[9px] text-[#00ff88] hover:underline font-mono">View All</button>
                            </div>
                            <div class="space-y-2">
                                ${toursHtml}
                            </div>
                        </div>

                        <!-- Mini Map details / Free Fire Gaming aesthetics -->
                        <div class="bg-gradient-to-r from-red-950/40 to-slate-900 rounded-xl p-3 border border-red-900/30">
                            <div class="flex items-center space-x-2 text-danger-glow font-bold text-xs uppercase mb-1">
                                <i data-lucide="flame" class="w-4 h-4 animate-bounce"></i>
                                <span>Weekly Top Duel Winners</span>
                            </div>
                            <p class="text-[10px] text-slate-400">Survival stakes are credited automatically in under 3 minutes upon match lobby closure and results confirmation.</p>
                        </div>
                    </div>
                `;
            },

            renderTournaments(container) {
                const tenant = getTenantObj();
                const regionTours = state.tournaments.filter(t => t.tenantId === state.currentTenantId);
                
                let matchesHtml = '';
                regionTours.forEach(t => {
                    const progressVal = Math.min(100, Math.floor((t.current / t.max) * 100));
                    
                    let badgeColor = "bg-gold-500/10 text-gold-500 border-gold-500/30";
                    let actionBtn = `<button onclick="App.navigateTo('tournament_detail_${t.id}')" class="bg-gold-500 hover:bg-gold-600 text-slate-950 font-black text-[10px] px-3.5 py-2 rounded-md uppercase tracking-wider transition">ENTER</button>`;
                    
                    if(t.status === 'full') {
                        badgeColor = "bg-danger-glow/10 text-danger-glow border-danger-glow/30";
                        actionBtn = `<span class="text-danger-glow text-[10px] font-bold uppercase font-mono px-2 py-1 bg-danger-glow/10 rounded border border-danger-glow/20">CLOSED</span>`;
                    }

                    matchesHtml += `
                        <div class="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-3">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="px-1.5 py-0.5 rounded text-[8px] font-bold border ${badgeColor} uppercase font-mono">${t.status}</span>
                                        <span class="text-[9px] text-[#00ff88] font-mono uppercase bg-slate-950 px-1 border border-slate-800 rounded font-bold">${t.mode}</span>
                                    </div>
                                    <h4 class="text-xs font-extrabold text-slate-100 mt-1.5">${t.name}</h4>
                                    <p class="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                                        <i data-lucide="clock" class="w-3 h-3 text-slate-500"></i> ${t.time}
                                    </p>
                                </div>
                                <div class="text-right flex-shrink-0">
                                    <span class="text-[8px] uppercase tracking-wider text-slate-400 font-mono">Prizepool</span>
                                    <h5 class="text-sm font-black text-gold-500 tracking-tight">${tenant.symbol}${t.prizePool.toLocaleString()}</h5>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <div class="flex justify-between text-[9px] font-mono text-slate-400">
                                    <span>Lobby slots: <strong class="text-slate-100">${t.current}/${t.max}</strong></span>
                                    <span>${progressVal}% Allocated</span>
                                </div>
                                <div class="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-800">
                                    <div class="bg-gold-500 h-full rounded-full" style="width: ${progressVal}%"></div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between pt-1.5 border-t border-slate-800">
                                <div class="flex items-center gap-1 text-[10px] text-slate-400">
                                    <span>Entry: <strong class="text-slate-100 font-mono">${tenant.symbol}${t.entryFee.toLocaleString()}</strong></span>
                                </div>
                                ${actionBtn}
                            </div>
                        </div>
                    `;
                });

                if(regionTours.length === 0) {
                    matchesHtml = `
                        <div class="text-center py-10 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2">
                            <i data-lucide="swords" class="w-8 h-8 text-slate-600 mx-auto"></i>
                            <h5 class="text-xs font-bold text-slate-300">Tenant Lobby Empty</h5>
                            <p class="text-[10px] text-slate-500 font-mono">No tournaments schedules found inside ${tenant.name}.</p>
                        </div>
                    `;
                }

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-sm font-black uppercase text-slate-200 tracking-wider">🎮 Free Fire Esport Leagues</h2>
                                <p class="text-[10px] text-slate-400">Participate in regional matches scoped by currency</p>
                            </div>
                            <span class="text-xs bg-slate-900 border border-slate-800 text-gold-500 px-2 py-1 rounded font-mono font-bold">${regionTours.length} Active</span>
                        </div>

                        <div class="space-y-3">
                            ${matchesHtml}
                        </div>
                    </div>
                `;
            },

            renderTournamentDetails(container, id) {
                const tour = state.tournaments.find(t => t.id === id);
                if(!tour) {
                    this.showToast("Tournament missing!", "error");
                    this.navigateTo('tournaments');
                    return;
                }

                const tenant = getTenantObj();
                const bal = getComputedBalance();
                const isJoined = tour.joined === true;

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <!-- Navigation Back Header -->
                        <button onclick="App.navigateTo('tournaments')" class="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 text-xs font-bold font-mono">
                            <i data-lucide="arrow-left" class="w-4 h-4"></i>
                            <span>BACK TO TOURNAMENTS</span>
                        </button>

                        <!-- Banner card styling -->
                        <div class="relative overflow-hidden rounded-2xl bg-[#0f172a] h-32 flex items-end p-4 border border-slate-800">
                            <!-- Overlay gradients -->
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
                            
                            <!-- Design elements representing Bermuda map -->
                            <div class="absolute right-[-10px] top-[-10px] opacity-20 w-36 h-36 border border-slate-800 rotate-12 flex items-center justify-center rounded-3xl">
                                <i data-lucide="map" class="w-20 h-20 text-gold-500"></i>
                            </div>

                            <div class="relative z-20 space-y-1">
                                <span class="bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 text-[8px] font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">${tour.status}</span>
                                <h1 class="text-sm font-black text-slate-100 uppercase mt-1 tracking-tight">${tour.name}</h1>
                            </div>
                        </div>

                        <!-- Match specifications specs list bento gridding -->
                        <div class="grid grid-cols-3 gap-2">
                            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                                <span class="text-[8px] uppercase font-bold text-slate-500">Map Arena</span>
                                <p class="text-[10px] font-bold text-slate-200 capitalize font-mono">${tour.map}</p>
                            </div>
                            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                                <span class="text-[8px] uppercase font-bold text-slate-500">Combats Mode</span>
                                <p class="text-[10px] font-bold text-slate-200 font-mono">${tour.mode}</p>
                            </div>
                            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800 text-center space-y-0.5">
                                <span class="text-[8px] uppercase font-bold text-slate-500">Prizepool</span>
                                <p class="text-[10px] font-extrabold text-gold-500 font-mono">${tenant.symbol}${tour.prizePool.toLocaleString()}</p>
                            </div>
                        </div>

                        <!-- System rules card -->
                        <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                            <h3 class="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                                <i data-lucide="shield-check" class="w-4 h-4 text-gold-500"></i> Rules & Regulation Details
                            </h3>
                            <ul class="space-y-1.5 text-[10px] text-slate-400 font-sans">
                                <li class="flex items-start gap-1">
                                    <span class="text-gold-500 mt-0.5">•</span>
                                    <span>Lobby codes are auto-dispatched through the Telegram Bot exactly 10 minutes prior to matchmaking.</span>
                                </li>
                                <li class="flex items-start gap-1">
                                    <span class="text-gold-500 mt-0.5">•</span>
                                    <span>Anti-cheat monitoring is fully mandatory; no simulators or third-party hacks allowed.</span>
                                </li>
                                <li class="flex items-start gap-1">
                                    <span class="text-gold-500 mt-0.5">•</span>
                                    <span>Payouts are trace-booked to users corresponding to audit results verified within 30 minutes.</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Slots filling meter -->
                        <div class="bg-slate-900 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                            <span class="text-slate-400">Staked Entry Fee:</span>
                            <span class="text-sm font-extrabold text-gold-500 font-mono">${tenant.symbol}${tour.entryFee.toLocaleString()}</span>
                        </div>

                        <!-- CTA Dynamic join trigger -->
                        ${isJoined ? `
                            <div class="bg-[#0f1d15] text-[#00ff88] border border-success-glow/30 p-4 rounded-xl text-center space-y-1 animate-fadeIn">
                                <i data-lucide="check-circle" class="w-8 h-8 text-success-glow mx-auto mb-1"></i>
                                <h4 class="text-xs font-bold uppercase">ALREADY REGISTERED</h4>
                                <p class="text-[9px] text-slate-300">Lobby room code release scheduled down: T-Minus 15 minutes before slot open.</p>
                            </div>
                        ` : `
                            <button onclick="App.joinTournament('${tour.id}')" class="w-full bg-gold-400 hover:bg-gold-500 text-slate-950 font-black text-xs py-3 rounded-xl uppercase tracking-widest shadow-lg neon-glow-gold transition-all duration-150">
                                REGISTER TO duel NOW (${tenant.symbol}${tour.entryFee.toLocaleString()})
                            </button>
                        `}
                    </div>
                `;
            },

            joinTournament(id) {
                const tour = state.tournaments.find(t => t.id === id);
                if(!tour) return;
                
                const tenant = getTenantObj();
                const bal = getComputedBalance();

                if (bal < tour.entryFee) {
                    this.showToast(`Insufficient balance! Need ${tenant.symbol}${tour.entryFee.toLocaleString()}`, "error");
                    this.navigateTo('wallet');
                    return;
                }

                // Deduct entry stake from user ledger
                const ref = `BA-STAKE-${Math.floor(100000 + Math.random() * 900000)}`;
                const newTxn = {
                    id: state.ledger.length + 1,
                    walletId: `BA-${state.user.id}-LEDG`,
                    reference: ref,
                    type: "debit",
                    amount: tour.entryFee,
                    desc: `Match Arena Entry fee: ${tour.name}`,
                    date: new Date().toISOString().replace('T', ' ').substring(0, 19)
                };

                state.ledger.push(newTxn);
                tour.current += 1;
                tour.joined = true;
                saveState();

                this.log('LEDGER_DEBIT', `Allocated and bound Match Entry Stake to Ledger. Transaction Index registered: ${ref}`, `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${state.user.id}-LEDG', '${ref}', 'debit', ${tour.entryFee}, 'Stake: ${tour.name}');`);
                this.showToast("Registered Successfully! Entry fee debited.", "success");
                
                // Re-render
                this.navigateTo(`tournament_detail_${id}`);
            },

            renderTeams(container) {
                const tenant = getTenantObj();
                const filteredTeams = state.teams.filter(t => t.tenantId === state.currentTenantId);

                let teamsHtml = '';
                filteredTeams.forEach(t => {
                    teamsHtml += `
                        <div class="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-2.5">
                                    <div class="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-sm shadow neon-glow-gold">
                                        🛡️
                                    </div>
                                    <div>
                                        <h4 class="text-xs font-bold text-slate-100">${t.name}</h4>
                                        <p class="text-[9px] text-slate-400 font-mono">Leader: @${t.leader}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[8px] uppercase text-slate-500 block font-mono">Total wins</span>
                                    <span class="text-xs font-extrabold text-[#00ff88] font-mono">${t.wins} Matches</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center justify-between bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
                                <span class="text-[9px] font-mono text-slate-400">Roster: <strong class="text-slate-300">${t.members.join(', ')}</strong></span>
                                <span class="text-[10px] text-slate-500 font-mono">${t.members.length}/4</span>
                            </div>
                        </div>
                    `;
                });

                if(filteredTeams.length === 0) {
                    teamsHtml = `<div class="text-center py-6 text-slate-500 text-[10px] font-mono">No active clans logged under this region.</div>`;
                }

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-sm font-black uppercase text-slate-200 tracking-wider">👥 Squad Clans</h1>
                                <p class="text-[10px] text-slate-400">Form four-man rosters to dominate leagues</p>
                            </div>
                            <button onclick="App.showCreateClanModal()" class="bg-gold-500 text-slate-950 px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase font-mono shadow">+ New Clan</button>
                        </div>

                        <div class="space-y-3">
                            ${teamsHtml}
                        </div>
                    </div>
                `;
            },

            showCreateClanModal() {
                const modal = document.getElementById('global-modal');
                modal.classList.remove('hidden');

                modal.innerHTML = `
                    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs p-4 space-y-4 animate-fadeIn select-none">
                        <div>
                            <h3 class="text-xs font-black uppercase text-slate-200 tracking-wider">🛡️ Form New Clan</h3>
                            <p class="text-[9px] text-slate-400 mt-1">Found a premium esport team scoped under ${getTenantObj().name}</p>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-400 block font-mono">CLAN DESIGNATION NAME</label>
                            <input id="clan-name-input" type="text" placeholder="e.g. Lagos Outlaws" class="w-full bg-slate-950 border border-slate-800 focus:border-gold-500 font-mono text-xs px-3 py-2 rounded focus:outline-none text-slate-200">
                        </div>
                        <div class="flex items-center space-x-2 pt-2">
                            <button onclick="App.closeModal()" class="w-1/2 border border-slate-800 rounded py-2 text-[10px] font-bold font-mono text-slate-400 hover:text-slate-200 uppercase">Cancel</button>
                            <button onclick="App.createClan()" class="w-1/2 bg-gold-500 text-slate-950 rounded py-2 text-[10px] font-extrabold uppercase shadow">Assemble</button>
                        </div>
                    </div>
                `;
            },

            closeModal() {
                document.getElementById('global-modal').classList.add('hidden');
            },

            createClan() {
                const input = document.getElementById('clan-name-input');
                const name = input ? input.value.trim() : '';

                if(!name) {
                    this.showToast("Clan name required!", "error");
                    return;
                }

                // Append new team to the client state
                const newTeam = {
                    id: `tm_${Date.now()}`,
                    tenantId: state.currentTenantId,
                    name: name,
                    leader: state.user.username,
                    wins: 0,
                    members: [state.user.username]
                };

                state.teams.unshift(newTeam);
                saveState();

                this.log('TEAM_CREATION', `Founded squad organization [${name}]. Scoped UUID tenant bind completed.`, `INSERT INTO teams (id, tenant_id, name, leader_id, member_names) VALUES ('${newTeam.id}', '${state.currentTenantId}', '${name}', ${state.user.id}, '["${state.user.username}"]');`);
                this.showToast(`Clan [${name}] Assemble Complete!`, "success");
                
                this.closeModal();
                this.navigateTo('teams');
            },

            renderWallet(container) {
                const tenant = getTenantObj();
                const bal = getComputedBalance();

                // Sort ledger from latest transactions down
                let ledgerHtml = '';
                const sortedLedger = [...state.ledger].reverse();

                sortedLedger.forEach(txn => {
                    const isCredit = txn.type === 'credit';
                    const symbol = isCredit ? '+' : '-';
                    const color = isCredit ? 'text-[#00ff88]' : 'text-[#ff4466]';
                    
                    ledgerHtml += `
                        <div class="flex items-center justify-between p-2.5 bg-slate-950 border-b border-slate-900 last:border-b-0">
                            <div class="min-w-0">
                                <h4 class="text-[10px] font-bold text-slate-200 truncate pr-2">${txn.desc}</h4>
                                <span class="text-[8px] text-slate-500 font-mono block mt-0.5">${txn.date} | Ref: ${txn.reference}</span>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <span class="text-[11px] font-black ${color} font-mono">${symbol}${tenant.symbol}${txn.amount.toLocaleString(undefined, {minimumFractionDigits: 1})}</span>
                            </div>
                        </div>
                    `;
                });

                if(sortedLedger.length === 0) {
                    ledgerHtml = `<div class="text-center py-6 text-slate-500 text-[10px] font-mono">Transaction ledger logs clear.</div>`;
                }

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-sm font-black uppercase text-slate-200 tracking-wider">💰 Fintech Core Wallet</h2>
                                <p class="text-[10px] text-slate-400 md:block hidden">Double-Entry Ledger Architecture Overview</p>
                            </div>
                            <span class="text-[9px] bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Traceable Books</span>
                        </div>

                        <!-- Balance Card component styled like moniepoint/opay -->
                        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 p-5 border border-slate-800 space-y-3 shadow-2xl">
                            <div class="absolute right-0 top-0 w-24 h-24 bg-gold-500/[0.04] blur-xl rounded-full"></div>
                            
                            <div class="space-y-1">
                                <h4 class="text-[8px] tracking-wider text-slate-500 uppercase font-extrabold flex items-center gap-1">
                                    <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-gold-500"></i> Double-entry immutable account
                                </h4>
                                <div class="flex items-baseline space-x-1.5 pt-1">
                                    <span class="text-2xl font-black text-slate-100 select-all">${tenant.symbol}${bal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    <span class="text-[10px] font-mono font-bold text-slate-400">${tenant.currency}</span>
                                </div>
                            </div>

                            <div class="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2">
                                <button onclick="App.navigateTo('deposit')" class="bg-gold-500 hover:bg-gold-600 text-slate-950 py-2 rounded-xl text-[10px] font-extrabold uppercase flex items-center justify-center gap-1 tracking-wider shadow">
                                    <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> FUND WALLET
                                </button>
                                <button onclick="App.navigateTo('withdraw')" class="bg-slate-905 hover:bg-slate-800 border border-slate-800 py-2 rounded-xl text-[10px] font-extrabold uppercase flex items-center justify-center gap-1 tracking-wider text-slate-300">
                                    <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> PAYOUT
                                </button>
                            </div>
                        </div>

                        <!-- Ledger logs lists -->
                        <div class="space-y-2">
                            <h3 class="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                                <i data-lucide="file-text" class="w-4 h-4 text-gold-500"></i> Transaction Ledger Ledger
                            </h3>
                            <div class="bg-slate-900/40 border border-slate-900 rounded-xl overflow-hidden shadow-inner">
                                ${ledgerHtml}
                            </div>
                        </div>

                        <!-- Security message notices -->
                        <p class="text-[8px] text-slate-500 font-mono leading-relaxed text-center">Accounts balance balances correspond solely to computed ledger SUM summaries. Zero manual account modification enabled. System auditor compliance active.</p>
                    </div>
                `;
            },

            renderDeposit(container) {
                const tenant = getTenantObj();
                this.log('DEPOSIT_LOBBY', `Loading dynamic virtual funding accounts for tenant ${tenant.name}`, `SELECT * FROM tenant_settings WHERE tenant_id = "${tenant.id}";`);
                
                let accountsHtml = '';
                if(state.currentTenantId === 'ba_nigeria') {
                    accountsHtml = `
                        <div class="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                <div>
                                    <h4 class="text-xs font-extrabold text-slate-100">🇳🇬 Monnify Virtual Account</h4>
                                    <p class="text-[8px] text-slate-400 font-mono mt-0.5">Instant Automated Gateway</p>
                                </div>
                                <span class="bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20 px-1 text-[8px] font-mono rounded font-bold uppercase">Active</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                <div>
                                    <span class="text-slate-500 block uppercase font-bold">BANK NAME:</span>
                                    <strong class="text-slate-300">WEMA Bank (Monnify)</strong>
                                </div>
                                <div>
                                    <span class="text-slate-500 block uppercase font-bold">ACCOUNT TITLE:</span>
                                    <strong class="text-slate-300 truncate block">BattleArena - Gladiator NG</strong>
                                </div>
                                <div class="col-span-2 pt-1 border-t border-slate-950 flex items-center justify-between">
                                    <div>
                                        <span class="text-slate-500 block uppercase font-bold">ACCOUNT NUMBER:</span>
                                        <strong class="text-sm font-extrabold text-gold-500">9812457220</strong>
                                    </div>
                                    <button onclick="App.copyAccount('9812457220')" class="bg-slate-950 border border-slate-800 text-[10px] font-bold py-1 px-2.5 rounded text-slate-300 active:bg-slate-900 flex items-center gap-1">
                                        <i data-lucide="copy" class="w-3.5 h-3.5 text-gold-500"></i> COPY
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Ghana / Kenya fallback accounts
                    accountsHtml = `
                        <div class="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-3">
                            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                                <div>
                                    <h4 class="text-xs font-extrabold text-slate-100">${tenant.flag} Paystack Mobile Money</h4>
                                    <p class="text-[8px] text-slate-400 font-mono mt-0.5">Standard Checkout</p>
                                </div>
                                <span class="bg-gold-500/10 text-gold-500 border border-gold-500/20 px-1 text-[8px] font-mono rounded font-bold uppercase">SaaS Node</span>
                            </div>
                            <p class="text-[10px] text-slate-400 font-mono text-center py-2">Transfer MoMo funds directly matching standard region gateway requirements.</p>
                        </div>
                    `;
                }

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <button onclick="App.navigateTo('wallet')" class="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 text-xs font-bold font-mono">
                            <i data-lucide="arrow-left" class="w-4 h-4"></i>
                            <span>BACK TO WALLET</span>
                        </button>

                        <div>
                            <h2 class="text-sm font-black uppercase text-slate-200 tracking-wider">📥 Fund Account (Ledger Credit)</h2>
                            <p class="text-[10px] text-slate-400">Add credit stakes to your regional gaming wallet</p>
                        </div>

                        ${accountsHtml}

                        <!-- Sandbox Mock Funding Module -->
                        <div class="bg-slate-900/50 p-4 rounded-2xl border border-dashed border-slate-800 space-y-3">
                            <div>
                                <h4 class="text-xs font-bold text-slate-300 flex items-center gap-1">
                                    <i data-lucide="terminal" class="w-4 h-4 text-gold-500"></i> Sandbox Instant Fund Bypass
                                </h4>
                                <p class="text-[9px] text-slate-500 font-mono mt-0.5">Instantly mimic credit webhook triggers directly on developer environment</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <input id="deposit-amount-input" type="number" placeholder="Enter amount..." class="flex-1 bg-slate-950 border border-slate-800 rounded focus:border-gold-500 focus:outline-none text-xs font-mono py-2.5 px-3 text-slate-200">
                                <button onclick="App.triggerMockDeposit()" class="bg-success-glow/20 hover:bg-success-glow/30 text-[#00ff88] border border-success-glow/40 font-mono text-[10px] font-bold uppercase rounded py-2.5 px-4">CREDIT</button>
                            </div>
                        </div>
                    </div>
                `;
            },

            copyAccount(digitStr) {
                navigator.clipboard.writeText(digitStr);
                this.showToast("Account Number Copied! Send transfer funds.", "gold");
            },

            triggerMockDeposit() {
                const input = document.getElementById('deposit-amount-input');
                const amt = parseFloat(input ? input.value : '');

                if(!amt || amt <= 0) {
                    this.showToast("Invalid amount value!", "error");
                    return;
                }

                // Credit simulated ledger audit book
                const tenant = getTenantObj();
                const ref = `BA-MOCK-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
                const newTxn = {
                    id: state.ledger.length + 1,
                    walletId: `BA-${state.user.id}-LEDG`,
                    reference: ref,
                    type: "credit",
                    amount: amt,
                    desc: "Simulated Deposit Webhook Received (Sandbox Bypass)",
                    date: new Date().toISOString().replace('T', ' ').substring(0, 19)
                };

                state.ledger.push(newTxn);
                saveState();

                this.log('LEDGER_CREDIT', `Direct deposit webhook captured. Credit logged: +${tenant.symbol}${amt}.`, `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${state.user.id}-LEDG', '${ref}', 'credit', ${amt}, 'Mock manual cred');`);
                this.showToast(`Credited +${tenant.symbol}${amt.toLocaleString()} to ledger!`, "success");
                
                this.navigateTo('wallet');
            },

            renderWithdraw(container) {
                const tenant = getTenantObj();
                this.log('WITHDRAWAL_INIT', 'Verifying financial limits for computed ledger balances', `SELECT SUM(amount) FROM wallet_ledger WHERE wallet_id = "BA-${state.user.id}-LEDG";`);

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <button onclick="App.navigateTo('wallet')" class="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 text-xs font-bold font-mono">
                            <i data-lucide="arrow-left" class="w-4 h-4"></i>
                            <span>BACK TO WALLET</span>
                        </button>

                        <div>
                            <h2 class="text-sm font-black uppercase text-slate-200 tracking-wider">📤 Request Withdrawal (Ledger Debit)</h2>
                            <p class="text-[10px] text-slate-400">Payout tournament earnings directly into your regional bank</p>
                        </div>

                        <!-- Withdrawal Form Card -->
                        <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-slate-400 block font-mono">SELECT BANK ARCHITECTURE</label>
                                <select id="withdraw-bank" class="w-full bg-slate-950 border border-slate-800 rounded font-mono text-xs px-2.5 py-2 focus:outline-none focus:border-gold-500">
                                    <option value="access">Access Bank Plc</option>
                                    <option value="gtb">Guaranty Trust Bank</option>
                                    <option value="zenith">Zenith Bank International</option>
                                    <option value="momo">MTN Mobile Money Checkpoint</option>
                                </select>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-slate-400 block font-mono">ACCOUNT DESTINATION DIGITS</label>
                                <input id="withdraw-acc" type="text" placeholder="e.g. 0122453664" class="w-full bg-slate-950 border border-slate-800 focus:border-gold-500 font-mono text-xs px-2.5 py-2 rounded focus:outline-none text-slate-200">
                            </div>

                            <div class="space-y-1">
                                <label class="text-[9px] font-bold text-slate-400 block font-mono">PAYOUT VOLUME AMOUNT (${tenant.currency})</label>
                                <input id="withdraw-amount" type="number" placeholder="e.g. 5000" class="w-full bg-slate-950 border border-slate-800 focus:border-gold-500 font-mono text-xs px-2.5 py-2 rounded focus:outline-none text-slate-200">
                            </div>

                            <button onclick="App.triggerWithdrawal()" class="w-full bg-gold-500 hover:bg-gold-600 text-slate-950 font-black text-xs py-3 rounded-xl uppercase tracking-widest transition shadow-lg neon-glow-gold">
                                TRANSMIT FUNDS REQUEST
                            </button>
                        </div>

                        <p class="text-[8px] text-slate-500 font-mono leading-relaxed text-center">Standard withdrawals require compliance checks. Payout verification generally completes in under 20 minutes under normal operations.</p>
                    </div>
                `;
            },

            triggerWithdrawal() {
                const bank = document.getElementById('withdraw-bank').value;
                const acc = document.getElementById('withdraw-acc').value.trim();
                const amt = parseFloat(document.getElementById('withdraw-amount').value);

                if(!acc || isNaN(amt) || amt <= 0) {
                    this.showToast("All input parameters required!", "error");
                    return;
                }

                const tenant = getTenantObj();
                const bal = getComputedBalance();

                if(amt > bal) {
                    this.showToast(`Insufficient balance! Your current limit is ${tenant.symbol}${bal.toLocaleString()}`, "error");
                    return;
                }

                // Debit requested funds from immutable ledger state
                const ref = `BA-WIT-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
                const newTxn = {
                    id: state.ledger.length + 1,
                    walletId: `BA-${state.user.id}-LEDG`,
                    reference: ref,
                    type: "debit",
                    amount: amt,
                    desc: `Withdrawal payout requested: [${bank.toUpperCase()} - ${acc}]`,
                    date: new Date().toISOString().replace('T', ' ').substring(0, 19)
                };

                state.ledger.push(newTxn);
                saveState();

                this.log('LEDGER_DEBIT', `Transacted secure Debit payout reference: ${ref}`, `INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES ('BA-${state.user.id}-LEDG', '${ref}', 'debit', ${amt}, 'Debit payout requested');`);
                this.showToast("Payout Request Transmitted. Processing dispatch...", "success");

                this.navigateTo('wallet');
            },

            renderLeaderboard(container) {
                const tenant = getTenantObj();
                
                // Static rankings high stakes list with premium glow on top 3
                const players = [
                    { rank: 1, name: "ViperKingFF", wins: 142, earnings: 450000.0, avatar: "🔥" },
                    { rank: 2, name: "Accra_Glider", wins: 112, earnings: 320000.0, avatar: "💀" },
                    { rank: 3, name: "LagosDemon", wins: 98, earnings: 180000.0, avatar: "⚡" },
                    { rank: 4, name: "DeltaCombat", wins: 72, earnings: 110000.0, avatar: "👑" },
                    { rank: 5, name: "SafariKilla", wins: 54, earnings: 75000.0, avatar: "🦊" }
                ];

                let boardHtml = '';
                players.forEach(p => {
                    let rankStyle = "bg-slate-950 border border-slate-800 text-slate-400";
                    let rowBorder = "border-slate-900";
                    let shadowStyle = "";

                    if(p.rank === 1) {
                        rankStyle = "bg-gold-500 text-slate-950 font-black";
                        rowBorder = "border-gold-500/20";
                        shadowStyle = "neon-glow-gold";
                    } else if(p.rank === 2) {
                        rankStyle = "bg-slate-300 text-slate-950 font-black";
                        rowBorder = "border-slate-300/10";
                    } else if(p.rank === 3) {
                        rankStyle = "bg-amber-600 text-slate-950 font-black";
                    }

                    boardHtml += `
                        <div class="flex items-center justify-between p-3 bg-slate-900 rounded-xl border ${rowBorder} ${shadowStyle}">
                            <div class="flex items-center space-x-3 min-w-0">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${rankStyle}">
                                    ${p.rank}
                                </div>
                                <span class="text-xs font-extrabold text-slate-100 truncate">${p.avatar} ${p.name}</span>
                            </div>
                            <div class="text-right flex-shrink-0">
                                <p class="text-[10px] font-bold text-[#00ff88] font-mono">${p.wins} Wins</p>
                                <span class="text-[8px] text-slate-400 font-mono uppercase block mt-0.5">EST: ${tenant.symbol}${(p.earnings * tenant.mult).toLocaleString()}</span>
                            </div>
                        </div>
                    `;
                });

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none">
                        <div>
                            <h2 class="text-sm font-black uppercase text-slate-200 tracking-wider">👑 Leaderboard Rankings</h2>
                            <p class="text-[10px] text-slate-400">Dominant players based on verified tournament victories</p>
                        </div>

                        <!-- Highlights Tabs -->
                        <div class="bg-slate-900/50 p-1 rounded-xl border border-slate-900 flex text-center">
                            <button class="w-1/3 bg-slate-950 text-gold-500 text-[10px] font-mono font-bold py-1.5 rounded-lg border border-slate-800">Global</button>
                            <button onclick="App.showToast('Weekly reset matches schedules scheduled Sunday.', 'info')" class="w-1/3 text-slate-400 text-[10px] font-mono py-1.5 rounded-lg">Weekly</button>
                            <button onclick="App.showToast('Monthly rewards locked.', 'info')" class="w-1/3 text-slate-400 text-[10px] font-mono py-1.5 rounded-lg">Monthly</button>
                        </div>

                        <div class="space-y-2">
                            ${boardHtml}
                        </div>
                    </div>
                `;
            },

            renderProfile(container) {
                const tenant = getTenantObj();
                const bal = getComputedBalance();

                container.innerHTML = `
                    <div class="p-4 space-y-4 animate-fadeIn select-none text-center">
                        <!-- Header user card component -->
                        <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3 relative overflow-hidden">
                            <div class="absolute right-0 top-0 text-slate-950 opacity-10">
                                <i data-lucide="shield" class="w-24 h-24"></i>
                            </div>
                            <div class="w-16 h-16 bg-slate-950 border-2 border-gold-500 text-3xl flex items-center justify-center rounded-full mx-auto shadow-lg neon-glow-gold">
                                ${state.user.avatar}
                            </div>
                            <div>
                                <h3 class="text-sm font-black text-slate-100 flex items-center justify-center gap-1">@${state.user.username} <i data-lucide="key" class="w-4 h-4 text-gold-500"></i></h3>
                                <p class="text-[8px] text-slate-500 font-mono mt-0.5">MD5_JWT: Sim_Auth_Validated</p>
                            </div>
                        </div>

                        <!-- Stats grid representation -->
                        <div class="grid grid-cols-3 gap-2">
                            <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <span class="text-[8px] uppercase font-bold text-slate-400 block font-mono">Duels Fight</span>
                                <strong class="text-sm font-black text-slate-200 font-mono">${state.user.matchesPlayed}</strong>
                            </div>
                            <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <span class="text-[8px] uppercase font-bold text-slate-400 block font-mono">VICTORIES</span>
                                <strong class="text-sm font-black text-[#00ff88] font-mono">${state.user.wins}</strong>
                            </div>
                            <div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <span class="text-[8px] uppercase font-bold text-slate-400 block font-mono">STRIKE Kills</span>
                                <strong class="text-sm font-black text-danger-glow font-mono">${state.user.kills}</strong>
                            </div>
                        </div>

                        <!-- Affiliate referral tracker -->
                        <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2 text-left">
                            <h4 class="text-xs font-black uppercase text-gold-500 tracking-wider flex items-center gap-1.5">
                                <i data-lucide="share-2" class="w-4 h-4 text-gold-500"></i> Affiliate Referral Program
                            </h4>
                            <p class="text-[10px] text-slate-400 leading-relaxed">Secure 5% ledger balance credits matching stake entries of direct referrals.</p>
                            <div class="flex items-center space-x-2 pt-1">
                                <div class="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-[10px] text-slate-200 select-all border-dashed">${state.user.referralCode}</div>
                                <button onclick="App.copyReferral('${state.user.referralCode}')" class="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-slate-300 hover:text-slate-200 text-[10px] flex items-center gap-1">
                                    <i data-lucide="copy" class="w-3.5 h-3.5 text-gold-500"></i> COPY
                                </button>
                            </div>
                        </div>

                        <!-- Clear Session cache triggers -->
                        <button onclick="App.resetState()" class="w-full bg-[#1c0a0d] hover:bg-red-950/20 text-[#ff4444] border border-[#ef4444]/20 font-mono py-2.5 rounded-xl text-[10px] font-bold uppercase transition">
                            RE-INITIALIZE DEMO DATA
                        </button>
                    </div>
                `;
            },

            copyReferral(code) {
                navigator.clipboard.writeText(code);
                this.showToast("Referral code copied! Share with squads.", "gold");
            },

            resetState() {
                localStorage.removeItem('battlearena_v2_state');
                state = DEFAULT_STATE;
                saveState();
                this.showToast("Simulation database restored to initial defaults.", "info");
                this.navigateTo('home');
            }
        };

        // Run framework bootstrap initializer upon page content mount
        window.addEventListener('DOMContentLoaded', () => {
            App.init();
        });
    </script>
</body>
</html>
