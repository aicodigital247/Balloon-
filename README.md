# BattleArena v2 - Enterprise SaaS Multi-Tenant Core

Fintech-grade, high-performance Esport Tournament Management & Immutable Financial Ledger API built in native PHP 8.x + MySQLi, optimized for Telegram Mini App integrations.

## 🚀 Architectural Principles
- **No Node.js Overhead on Production**: Extremely fast server-side execution via native FastCGI.
- **Fintech Ledger Integrity**: Strictly immutable wallet double-entry ledger. Live balances are calculated as `SUM(credits) - SUM(debits)` under table locks, protecting regional operators from stale-read double-spends.
- **Subdomain Tennant Discovery**: Automatically routes requests based on active subdomain or `X-Tenant-Group` headers, matching national currencies (₦, ₵, Ksh, R) and multipliers dynamically.
- **Telegram Native WebApp Verifications**: Secure HMAC SHA256 integrity checkers to validate player initData packages on entry.

## 📁 System Structure
- `/app/config/` - Isolated configuration sets (database, saas profiles, bot tokens, jwt parameters, gateway credentials).
- `/app/core/` - Custom microframework controllers, routers, singletons, and models.
- `/app/controllers/` - Regional game creation, balance ledgers, TG sessions, and payout modules.
- `/app/services/` - Monnify, Paystack, Flutterwave, and Telegram bot alert managers.
- `/cron/` - Auto-match lobby releases and payment audits.
- `/battlearena.sql` - Fully scripted database blueprints.

## 💾 Installation & Setup
1. Deploy `battlearena.sql` to your MySQL instance.
2. Clone this repository into your PHP v8.1+ host environment.
3. Configure the `.env` settings matching your server instance.
4. Run `composer install` to register PSR-4 class mapping.
5. In your Telegram Bot father console, bind the Bot WebApp address to `/public/index.php`.
