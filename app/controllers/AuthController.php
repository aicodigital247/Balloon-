<?php
/**
 * BattleArena v2 - Auth Controller
 */

namespace App\Controllers;

use App\Core\Controller;
use App\Core\TelegramAuth;
use App\Core\Security;
use App\Core\Database;

class AuthController extends Controller {
    
    /**
     * Verify telegram query authentication data
     */
    public function verifyTelegram() {
        $input = $this->getJsonInput();
        $initData = $input['initData'] ?? '';
        $botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '740242965888:AAEgladiatorSecretToken';

        if (empty($initData)) {
            $this->error("Query initData missing", 400);
        }

        $tgUser = TelegramAuth::verify($initData, $botToken);
        if (!$tgUser) {
            $this->error("Telegram integrity check compromised", 403);
        }

        $telegramId = (string)($tgUser['id'] ?? '');
        $username = $tgUser['username'] ?? 'AnonymousGamer';
        $firstName = $tgUser['first_name'] ?? 'Legit Player';

        $db = Database::getConnection();
        
        // Dynamic search for registered Telegram User in multi-tenant SaaS schema
        $stmt = mysqli_prepare($db, "SELECT * FROM users WHERE tenant_id = ? AND telegram_id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, "ss", $this->tenantId, $telegramId);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($res);
        mysqli_stmt_close($stmt);

        if (!$user) {
            // Register a brand new member in this tenant node
            $refCode = 'ARENA-' . strtoupper(substr($username, 0, 5)) . '-' . mt_rand(10, 99);
            $stmtInsert = mysqli_prepare($db, "INSERT INTO users (tenant_id, username, telegram_id, referral_code) VALUES (?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmtInsert, "ssss", $this->tenantId, $username, $telegramId, $refCode);
            mysqli_stmt_execute($stmtInsert);
            $newUserId = mysqli_insert_id($db);
            mysqli_stmt_close($stmtInsert);

            // Dynamically assign an Isolated Ledger Wallet
            $accountNo = 'BA-' . $telegramId . '-LEDG';
            $walletId = 'w_' . Security::generateUUID();
            $stmtWallet = mysqli_prepare($db, "INSERT INTO wallets (id, tenant_id, user_id, account_no) VALUES (?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmtWallet, "ssss", $walletId, $this->tenantId, $newUserId, $accountNo);
            mysqli_stmt_execute($stmtWallet);
            mysqli_stmt_close($stmtWallet);

            // Award a small welcome bonus to ledger
            $refInit = 'BA-INIT-' . mt_rand(10000, 99999);
            $bonusAmount = 10.00; // Recalculated by multipliers
            $stmtAward = mysqli_prepare($db, "INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES (?, ?, 'credit', ?, 'SaaS Welcome Balance Ledger Credit')");
            mysqli_stmt_bind_param($stmtAward, "sds", $walletId, $refInit, $bonusAmount);
            mysqli_stmt_execute($stmtAward);
            mysqli_stmt_close($stmtAward);

            $stmtSelect = mysqli_prepare($db, "SELECT * FROM users WHERE id = ? LIMIT 1");
            mysqli_stmt_bind_param($stmtSelect, "i", $newUserId);
            mysqli_stmt_execute($stmtSelect);
            $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtSelect));
            mysqli_stmt_close($stmtSelect);
        }

        $this->json([
            "status" => "success",
            "verified" => true,
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "referral_code" => $user['referral_code'],
                "avatar" => $user['avatar_url']
            ],
            "token" => "JWT-SIMULATED-SECURE-HEADER-FOR-FINTECH"
        ]);
    }

    public function checkSession() {
        $this->json([
            "status" => "success",
            "active" => true,
            "tenant_context" => $this->tenantId
        ]);
    }
}
