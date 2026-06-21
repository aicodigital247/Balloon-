-- -------------------------------------------------------------
-- BATTLEARENA v2 ARCHITECTURE - SQL SCHEMA
-- OPTIMIZED FOR FINTECH-GRADE MULTI-TENANT LEDGER PERFORMANCE
-- -------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SaaS Tenants Table (Logical separation of regional operations)
DROP TABLE IF EXISTS tenants;
CREATE TABLE tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    entry_multiplier DECIMAL(15, 4) DEFAULT 1.0000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. System Settings Table (Global Config scoped by Tenant)
DROP TABLE IF EXISTS system_settings;
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50),
    key_name VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tenant-scoped Users (Fintech JWT ready & Telegram Unique IDs)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    telegram_id VARCHAR(100) NOT NULL,
    telegram_username VARCHAR(100),
    avatar_url VARCHAR(255) DEFAULT '🏆',
    referral_code VARCHAR(30) UNIQUE NOT NULL,
    referred_by_code VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY uq_tenant_telegram (tenant_id, telegram_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Wallets (Tenant-Isolated Financial records)
DROP TABLE IF EXISTS wallets;
CREATE TABLE wallets (
    id VARCHAR(50) PRIMARY KEY, -- Tenant-scoped UUID based
    tenant_id VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    account_no VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Wallet Ledger (STRICTLY IMMUTABLE CO-ORDINATED TRANSACTION BOOKING)
-- NEVER store card-balance. Balance is live SUM(credit) - SUM(debit)
DROP TABLE IF EXISTS wallet_ledger;
CREATE TABLE wallet_ledger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id VARCHAR(50) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL, -- UUID/UUIDv4 fintech transaction index
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tournaments (Scoped by Tenancy)
DROP TABLE IF EXISTS tournaments;
CREATE TABLE tournaments (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    entry_fee DECIMAL(18, 4) NOT NULL,
    prize_pool DECIMAL(18, 4) NOT NULL,
    current_participants INT DEFAULT 0,
    max_participants INT NOT NULL,
    status ENUM('upcoming', 'registered', 'room_released', 'playing', 'completed') DEFAULT 'upcoming',
    room_code VARCHAR(100) DEFAULT NULL,
    winner_player_name VARCHAR(100) DEFAULT NULL,
    scheduled_time VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tournament Teams (Clans)
DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255) DEFAULT '🐺',
    leader_id BIGINT NOT NULL,
    member_names TEXT NOT NULL, -- JSON array of active members
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Notifications bot stack
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    is_bot_sent TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Referrals History Logger
DROP TABLE IF EXISTS referrals;
CREATE TABLE referrals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    referrer_id BIGINT NOT NULL,
    referred_id BIGINT UNIQUE NOT NULL,
    bonus_percentage INT DEFAULT 5,
    rewarded TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enable checks back
SET FOREIGN_KEY_CHECKS = 1;

-- -------------------------------------------------------------
-- SEED INITIAL SEED DATA
-- -------------------------------------------------------------
INSERT INTO tenants (id, name, country, currency, currency_symbol, entry_multiplier) VALUES 
('ba_nigeria', 'BattleArena Nigeria', 'Nigeria', 'NGN', '₦', 1000.0000),
('ba_ghana', 'BattleArena Ghana', 'Ghana', 'GHS', '₵', 10.0000),
('ba_kenya', 'BattleArena Kenya', 'Kenya', 'KES', 'Ksh', 100.0000),
('ba_south_africa', 'BattleArena South Africa', 'South Africa', 'ZAR', 'R', 15.0000);
