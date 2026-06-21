/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tenant, Tournament, LeaderboardUser, Team } from './types';

export const TENANTS: Tenant[] = [
  {
    id: "ba_nigeria",
    name: "BattleArena Nigeria",
    country: "Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
    flag: "🇳🇬",
    entryFeeMultiplier: 1000,
    depositMethods: ["Bank Transfer (Monnify)", "Card / USSD (Paystack)", "Flutterwave", "Opay Feed"]
  },
  {
    id: "ba_ghana",
    name: "BattleArena Ghana",
    country: "Ghana",
    currency: "GHS",
    currencySymbol: "₵",
    flag: "🇬🇭",
    entryFeeMultiplier: 10,
    depositMethods: ["Mtn Mobile Money", "Telecel Cash", "Paystack Ghana"]
  },
  {
    id: "ba_kenya",
    name: "BattleArena Kenya",
    country: "Kenya",
    currency: "KES",
    currencySymbol: "Ksh",
    flag: "🇰🇪",
    entryFeeMultiplier: 100,
    depositMethods: ["M-Pesa Express", "Airtel Money", "Flutterwave Kenya"]
  },
  {
    id: "ba_south_africa",
    name: "BattleArena South Africa",
    country: "South Africa",
    currency: "ZAR",
    currencySymbol: "R",
    flag: "🇿🇦",
    entryFeeMultiplier: 15,
    depositMethods: ["Ozow Instant EFT", "Capitec Pay", "Paystack South Africa"]
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: "tour_01",
    tenantId: "ba_nigeria",
    title: "Lagos Showdown: Battlegrounds Mobile",
    gameName: "PUBG Mobile",
    entryFee: 1500,
    prizePool: 65000,
    currentParticipants: 16,
    maxParticipants: 32,
    status: "upcoming",
    description: "Join Lagos's most aggressive survival event. Prove your squad's dominance and take a massive cut of the prize ledger.",
    scheduledTime: "18:00 Local Time"
  },
  {
    id: "tour_02",
    tenantId: "ba_nigeria",
    title: "Apex Arena: Elite Trios",
    gameName: "Apex Legends Mobile",
    entryFee: 1000,
    prizePool: 40000,
    currentParticipants: 20,
    maxParticipants: 20,
    status: "room_released",
    roomCode: "ARENA_NG_99812",
    description: "Apex Mobile Clash. Custom lobby details dispatched via active Telegram Bot integration Webhooks.",
    scheduledTime: "20:30 Local Time"
  },
  {
    id: "tour_03",
    tenantId: "ba_ghana",
    title: "Accra Clash of Champions",
    gameName: "Free Fire",
    entryFee: 15,
    prizePool: 600,
    currentParticipants: 8,
    maxParticipants: 16,
    status: "upcoming",
    description: "Accra Free Fire Battle Royale. Immutable ledger accounting ensures transparent entry fees and fast electronic payouts.",
    scheduledTime: "17:30 Local Time"
  },
  {
    id: "tour_04",
    tenantId: "ba_kenya",
    title: "Nairobi Rift Hunters Cup",
    gameName: "Mobile Legends",
    entryFee: 150,
    prizePool: 5000,
    currentParticipants: 10,
    maxParticipants: 10,
    status: "playing",
    description: "Mobile Legends 5v5 Brawl. Live feedback commentator API active.",
    scheduledTime: "Ready"
  },
  {
    id: "tour_05",
    tenantId: "ba_south_africa",
    title: "Cape Town Swift Strike League",
    gameName: "Call of Duty: Mobile",
    entryFee: 50,
    prizePool: 2500,
    currentParticipants: 12,
    maxParticipants: 24,
    status: "upcoming",
    description: "Cape Town COD Mobile deathmatch. Powered by decentralized multi-region SaaS services.",
    scheduledTime: "Tomorrow, 19:00"
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: "team_01",
    tenantId: "ba_nigeria",
    name: "Lagos Phantoms",
    logoUrl: "💀",
    leaderId: 981245722,
    memberNames: ["Gladiator22", "ShadowStalker", "ApexHunter", "DreadKnight"]
  },
  {
    id: "team_02",
    tenantId: "ba_nigeria",
    name: "Naija Cyber-Wolves",
    logoUrl: "🐺",
    leaderId: 1002,
    memberNames: ["TundeDev", "NnekaSniper", "ChidiTactics", "YusufGhost"]
  },
  {
    id: "team_03",
    tenantId: "ba_ghana",
    name: "Accra Black Stars",
    logoUrl: "⭐",
    leaderId: 2001,
    memberNames: ["KwameBuster", "AmaRush", "KojoShield"]
  }
];

export const INITIAL_LEADERBOARD: Record<string, LeaderboardUser[]> = {
  ba_nigeria: [
    { rank: 1, username: "ViperKing_NG", earnings: 245000, wins: 48, mvps: 32 },
    { rank: 2, username: "ArenaGladiator", earnings: 185000, wins: 39, mvps: 27 },
    { rank: 3, username: "TundeDev", earnings: 150000, wins: 32, mvps: 19 },
    { rank: 4, username: "Sola_Sniper", earnings: 92000, wins: 20, mvps: 11 }
  ],
  ba_ghana: [
    { rank: 1, username: "KwameBuster", earnings: 1950, wins: 38, mvps: 22 },
    { rank: 2, username: "GoldCoast_Pro", earnings: 1400, wins: 29, mvps: 17 },
    { rank: 3, username: "KofiStorm", earnings: 850, wins: 18, mvps: 9 }
  ],
  ba_kenya: [
    { rank: 1, username: "RiftRunner_KE", earnings: 15400, wins: 41, mvps: 29 },
    { rank: 2, username: "Kimathi_Gamer", earnings: 12200, wins: 34, mvps: 21 },
    { rank: 3, username: "SafariMage", earnings: 7100, wins: 19, mvps: 12 }
  ],
  ba_south_africa: [
    { rank: 1, username: "ZuluGlitch", earnings: 8200, wins: 45, mvps: 31 },
    { rank: 2, username: "TableMountain_FPS", earnings: 5600, wins: 31, mvps: 18 },
    { rank: 3, username: "SA_SniperElite", earnings: 3400, wins: 17, mvps: 11 }
  ]
};

// Raw PHP / SQL source code snippets to review in code examiner tab
export const ARCHITECTURE_FILES = [
  {
    path: "battlearena.sql",
    language: "sql",
    description: "Fintech Ledger & Multi-Tenant Relational Schema. Note that balances are computed live from transaction records.",
    code: `--
-- BattleArena v2 Architecture - SQL Schema
-- Optimized for Fintech-grade Multi-Tenant Ledger Performance
--

-- Enable tight constraints
SET FOREIGN_KEY_CHECKS = 1;

-- 1. SaaS Tenants Table
CREATE TABLE tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    entry_multiplier DECIMAL(10, 2) DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Settings Table (Global Config)
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50),
    key_name VARCHAR(100) NOT NULL,
    value TEXT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 3. Tenant-scoped Users (Fintech Grade JWT Auth & Unique Referrals)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    telegram_id VARCHAR(100),
    telegram_username VARCHAR(100),
    referral_code VARCHAR(30) UNIQUE,
    referred_by_code VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 4. Wallets (SaaS Multi-Tenant isolated)
CREATE TABLE wallets (
    id VARCHAR(50) PRIMARY KEY, -- Tenant-scoped unique uuid
    tenant_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    account_no VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Wallet Ledger (Fintech Standard - STRICTLY IMMUTABLE)
-- NEVER store balance directly. Balance is SUM(CREDIT) - SUM(DEBIT)
CREATE TABLE wallet_ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL, -- UUID/UUIDv4 fintech transaction index
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);

-- 6. Tournaments (Multi-Tenant, Managed Entries)
CREATE TABLE tournaments (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    entry_fee DECIMAL(18, 4) NOT NULL,
    prize_pool DECIMAL(18, 4) NOT NULL,
    status ENUM('upcoming', 'registered', 'room_released', 'playing', 'completed') DEFAULT 'upcoming',
    room_code VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Seed initial basic tenant configuration data
INSERT INTO tenants (id, name, country, currency, currency_symbol, entry_multiplier) VALUES 
('ba_nigeria', 'BattleArena Nigeria', 'Nigeria', 'NGN', '₦', 1000.00),
('ba_ghana', 'BattleArena Ghana', 'Ghana', 'GHS', '₵', 1.00),
('ba_kenya', 'BattleArena Kenya', 'Kenya', 'KES', 'Ksh', 10.00),
('ba_south_africa', 'BattleArena South Africa', 'South Africa', 'ZAR', 'R', 2.00);
`
  },
  {
    path: "app/config/database.php",
    language: "php",
    description: "Multi-tenant MySQLi connection helper. Strictly utilizes standard PHP mysqli extension wrapper.",
    code: `<?php
/**
 * BattleArena v2 - MySQLi Core Database Config
 * Multi-Tenant Scoped Connections & Singleton Pattern
 */

namespace App\\Config;

class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $user = getenv('DB_USER') ?: 'battle_user';
        $pass = getenv('DB_PASS') ?: 'secure_fin_pass';
        $name = getenv('DB_NAME') ?: 'battlearena_db';
        $port = getenv('DB_PORT') ?: 3306;

        // Strict MySQLi Only
        $this->conn = mysqli_init();
        if (!$this->conn) {
            throw new \\Exception("MySQLi initialization failed");
        }

        if (!@mysqli_real_connect($this->conn, $host, $user, $pass, $name, $port)) {
            throw new \\Exception("Connection failed: " . mysqli_connect_error());
        }

        mysqli_set_charset($this->conn, "utf8mb4");
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance->getConnection();
    }

    public function getConnection() {
        return $this->conn;
    }
}
`
  },
  {
    path: "app/core/Router.php",
    language: "php",
    description: "PHP custom micro-controller routing system mapped dynamically out of single entry points.",
    code: `<?php
/**
 * BattleArena Router - Highly optimized Custom Route Manager
 */

namespace App\\Core;

class Router {
    private $routes = [];
    private $tenantId;

    public function __construct() {
        // Detect current SaaS tenant subdomain or header
        $host = $_SERVER['HTTP_HOST'];
        $parts = explode('.', $host);
        
        // Multi-Tenant scopes subdomain (e.g. nigeria.battlearena.gg -> ba_nigeria)
        $this->tenantId = (count($parts) > 2) ? 'ba_' . $parts[0] : 'ba_nigeria';
    }

    public function add($method, $path, $handler) {
        $this->routes[strtoupper($method)][$path] = $handler;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        if (isset($this->routes[$method][$path])) {
            $handler = $this->routes[$method][$path];
            return $this->execute($handler);
        }

        // Return a beautiful dynamic error response
        http_response_code(404);
        echo json_encode(["error" => "Route not found in BattleArena routing tables"]);
    }

    private function execute($handler) {
        // Safe Controller Instantiation
        list($controllerName, $action) = explode('@', $handler);
        $fullController = "\\\\App\\\\Controllers\\\\" . $controllerName;
        
        if (class_exists($fullController)) {
            $controllerInstance = new $fullController($this->tenantId);
            return $controllerInstance->$action();
        }
        
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Routing dispatcher failed to load target module"]);
    }
}
`
  },
  {
    path: "app/services/WalletService.php",
    language: "php",
    description: "Stated ledger architecture calculating balances via mathematical SUM checks.",
    code: `<?php
/**
 * BattleArena v2 - Wallet & Ledger Implementation
 * Fully functional SUM(credit) - SUM(debit) formula with transaction logs
 */

namespace App\\Services;

use App\\Config\\Database;

class WalletService {
    private $db;
    private $tenantId;

    public function __construct($tenantId) {
        $this->db = Database::getInstance();
        $this->tenantId = $tenantId;
    }

    /**
     * Immutable Balance Check: SUM(credits) - SUM(debits)
     */
    public function getBalance($walletId) {
        // Prepared statements with MySQLi Bind Parameters
        $stmt = mysqli_prepare($this->db, "
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as balance
            FROM wallet_ledger
            WHERE wallet_id = ?
        ");
        
        mysqli_stmt_bind_param($stmt, "s", $walletId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        
        mysqli_stmt_close($stmt);
        return (float)($row['balance'] ?? 0.0);
    }

    /**
     * Add Ledger Entry (Credit/Debit atomic event)
     */
    public function transact($walletId, $amount, $type, $description, $ref = null) {
        if ($amount <= 0) {
            throw new \\Exception("Fintech standard: positive transaction values only");
        }
        
        if ($type !== 'credit' && $type !== 'debit') {
            throw new \\Exception("Invalid transaction type direction");
        }

        // Force unique transaction references
        $reference = $ref ?: 'BA-LEDG-' . uniqid() . '-' . mt_rand(1000, 9999);

        // Under high multi-user concurrent loads, we open a MySQLi transaction to prevent race conditions
        mysqli_begin_transaction($this->db);
        
        try {
            // If checking a transfer or debit transaction, verify balance first
            if ($type === 'debit') {
                $currentBalance = $this->getBalance($walletId);
                if ($currentBalance < $amount) {
                    throw new \\Exception("Insufficient funds in target ledger");
                }
            }

            // Execute insert query
            $stmt = mysqli_prepare($this->db, "
                INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) 
                VALUES (?, ?, ?, ?, ?)
            ");
            
            mysqli_stmt_bind_param($stmt, "sssds", $walletId, $reference, $type, $amount, $description);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);

            mysqli_commit($this->db);
            return [
                "success" => true,
                "reference" => $reference,
                "new_balance" => $this->getBalance($walletId)
            ];
        } catch (\\Exception $e) {
            mysqli_rollback($this->db);
            throw $e;
        }
    }
}
`
  },
  {
    path: "api/auth.php",
    language: "php",
    description: "Fintech Telegram Authentication endpoint. Processes telegram verification hashes securely.",
    code: `<?php
/**
 * Secure Telegram WebApp verification hook
 */

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$initData = $input['initData'] ?? '';
$botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '740242965888:AAEgladiatorSecretToken';

if (empty($initData)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Query initData missing"]);
    exit;
}

// Telegram SHA256 Verification check
$rawData = explode('&', $initData);
$authData = [];
foreach ($rawData as $item) {
    if (strpos($item, '=') !== false) {
        $parts = explode('=', $item, 2);
        $authData[$parts[0]] = urldecode($parts[1]);
    }
}

if (!isset($authData['hash'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Security verification hash not present"]);
    exit;
}

$hash = $authData['hash'];
unset($authData['hash']);

// Sort parameters alphabetically
ksort($authData);

// Construct data_check_string
$dataCheckArray = [];
foreach ($authData as $key => $value) {
    $dataCheckArray[] = "$key=$value";
}
$dataCheckString = implode("\\n", $dataCheckArray);

// Compute WebApp bot secret key
$secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
$computedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

if (hash_equals($hash, $computedHash)) {
    // Valid Telegram signature
    $telegramUser = json_decode($authData['user'], true);
    
    // Process matching SaaS multi-tenant user account inside BattleArena DB
    echo json_encode([
        "status" => "success",
        "verified" => true,
        "user" => [
            "id" => $telegramUser['id'],
            "username" => $telegramUser['username'] ?? 'AnonymousGamer',
            "name" => $telegramUser['first_name'] ?? 'Legit Player'
        ],
        "token" => "JWT-SIMULATED-SECURE-HEADER-FOR-FINTECH"
    ]);
} else {
    http_response_code(403);
    echo json_encode(["status" => "failed", "message" => "Telegram integrity check compromised"]);
}
`
  },
  {
    path: "index.php",
    language: "php",
    description: "Main HTML container serving Single Page JS framework directly to mobile viewport browsers.",
    code: `<?php
/**
 * BattleArena v2 - Single Page Web Gateway Entry
 */

// Block non-mobile layouts on index initialization
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$isMobile = preg_match('/Mobile|Android|iPhone|iPad/i', $userAgent);

// If running in development or embedding in a Telegram webview, check parameters
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>BattleArena v2 - Telegram Mini App</title>
    <!-- Tailwind CSS Integration CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #030712; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
    </style>
</head>
<body class="text-slate-100 overflow-hidden">

    <!-- Splash Screen overlay -->
    <div id="splash" class="fixed inset-0 bg-slate-950 flex flex-col justify-center items-center z-50">
        <div class="text-4xl font-bold font-display text-emerald-500 animate-pulse tracking-widest mb-2">BATTLEARENA v2</div>
        <div class="text-xs text-slate-500 font-mono">FINTECH-GRADE SECURITY INITIALIZING...</div>
    </div>

    <!-- Main Mobile Application Frame Container -->
    <main id="app" class="h-screen w-full max-w-md mx-auto relative bg-slate-950 flex flex-col">
        <!-- SPA view injection node -->
        <div id="page-content" class="flex-1 overflow-y-auto pb-24 p-4"></div>

        <!-- Sticky Bottom Menu with Navigation -->
        <nav class="absolute bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 flex justify-around py-3 text-slate-400 z-10">
            <button onclick="App.loadPage('dashboard')" class="flex flex-col items-center">
                <i data-lucide="home" class="w-5 h-5"></i><span class="text-[10px] mt-1 font-semibold">Home</span>
            </button>
            <button onclick="App.loadPage('tournaments')" class="flex flex-col items-center text-emerald-500">
                <i data-lucide="trophy" class="w-5 h-5"></i><span class="text-[10px] mt-1 font-semibold">Arena</span>
            </button>
            <button onclick="App.loadPage('teams')" class="flex flex-col items-center">
                <i data-lucide="users" class="w-5 h-5"></i><span class="text-[10px] mt-1 font-semibold">Teams</span>
            </button>
            <button onclick="App.loadPage('wallet')" class="flex flex-col items-center">
                <i data-lucide="wallet" class="w-5 h-5"></i><span class="text-[10px] mt-1 font-semibold">Ledger</span>
            </button>
            <button onclick="App.loadPage('profile')" class="flex flex-col items-center">
                <i data-lucide="user" class="w-5 h-5"></i><span class="text-[10px] mt-1 font-semibold">Profile</span>
            </button>
        </nav>
    </main>

    <!-- SPA Logic Controller Script -->
    <script>
        const App = {
            currentScreen: 'dashboard',
            loadPage: function(page) {
                this.currentScreen = page;
                console.log('Routing custom SPA module to:', page);
            }
        };
        
        window.addEventListener('load', () => {
            lucide.createIcons();
            setTimeout(() => {
                document.getElementById('splash').style.display = 'none';
            }, 1200);
        });
    </script>
</body>
</html>
`
  }
];
