<?php
/**
 * BattleArena v2 - Wallet Controller
 */

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Core\Auth;

class WalletController extends Controller {

    /**
     * Compute and output user live balance
     */
    public function getBalance() {
        $userObj = Auth::check();
        if (!$userObj) {
            $this->error("Unauthorized access payload", 401);
        }

        $db = Database::getConnection();

        $stmtWallet = mysqli_prepare($db, "SELECT id, account_no FROM wallets WHERE user_id = ? AND tenant_id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmtWallet, "is", $userObj['id'], $this->tenantId);
        mysqli_stmt_execute($stmtWallet);
        $wallet = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtWallet));
        mysqli_stmt_close($stmtWallet);

        if (!$wallet) {
            $this->error("Wallet node not bound for user", 404);
        }

        $walletId = $wallet['id'];

        // Core Balance Algorithm: Recalculate ledger SUM dynamically on load
        $stmtBalance = mysqli_prepare($db, "
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END), 0) as balance 
            FROM wallet_ledger 
            WHERE wallet_id = ?
        ");
        mysqli_stmt_bind_param($stmtBalance, "s", $walletId);
        mysqli_stmt_execute($stmtBalance);
        $bal = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtBalance));
        mysqli_stmt_close($stmtBalance);

        $this->json([
            "status" => "success",
            "walletId" => $walletId,
            "accountNo" => $wallet['account_no'],
            "balance" => (float)($bal['balance'] ?? 0.0)
        ]);
    }

    /**
     * Fetch entire transaction logs matching current account index.
     */
    public function getLedger() {
        $userObj = Auth::check();
        if (!$userObj) {
            $this->error("Unauthorized", 401);
        }

        $db = Database::getConnection();

        $stmtLedg = mysqli_prepare($db, "
            SELECT wl.* 
            FROM wallet_ledger wl
            JOIN wallets w ON wl.wallet_id = w.id
            WHERE w.user_id = ? AND w.tenant_id = ?
            ORDER BY wl.created_at DESC
        ");
        mysqli_stmt_bind_param($stmtLedg, "is", $userObj['id'], $this->tenantId);
        mysqli_stmt_execute($stmtLedg);
        $res = mysqli_stmt_get_result($stmtLedg);

        $logs = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $logs[] = [
                "id" => (int)$row['id'],
                "reference" => $row['reference'],
                "type" => $row['type'],
                "amount" => (float)$row['amount'],
                "description" => $row['description'],
                "createdAt" => $row['created_at']
            ];
        }
        mysqli_stmt_close($stmtLedg);

        $this->json($logs);
    }
}
