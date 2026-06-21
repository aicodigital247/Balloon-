<?php
/**
 * BattleArena v2 - Deposit Controller
 */

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Core\Auth;

class DepositController extends Controller {

    public function initiate() {
        $userObj = Auth::check();
        if (!$userObj) {
            $this->error("Unauthorized access key", 401);
        }

        $input = $this->getJsonInput();
        $amount = (float)($input['amount'] ?? 0);
        $method = $input['method'] ?? 'bank_transfer';

        if ($amount <= 0) {
            $this->error("Enter positive payment amounts only", 400);
        }

        $db = Database::getConnection();

        // Retrieve User wallet details
        $stmtW = mysqli_prepare($db, "SELECT id FROM wallets WHERE user_id = ? AND tenant_id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmtW, "is", $userObj['id'], $this->tenantId);
        mysqli_stmt_execute($stmtW);
        $wallet = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtW));
        mysqli_stmt_close($stmtW);

        if (!$wallet) {
            $this->error("Ledger account not configured for your Profile", 404);
        }

        $walletId = $wallet['id'];
        $ref = 'BA-LEDG-CR-' . mt_rand(100000, 999999);
        $desc = "Direct deposit from payment gateway method: " . htmlspecialchars($method);

        // Commit Credit
        $stmtCr = mysqli_prepare($db, "INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES (?, ?, 'credit', ?, ?)");
        mysqli_stmt_bind_param($stmtCr, "ssds", $walletId, $ref, $amount, $desc);
        mysqli_stmt_execute($stmtCr);
        mysqli_stmt_close($stmtCr);

        // Log notification log matching BOT templates
        $notifId = 'not_' . mt_rand(100000, 999999);
        $message = "Deposit Confirmation: Credit via " . $method . " webhook parsed. Received amount: " . $amount;
        $stmtNotif = mysqli_prepare($db, "INSERT INTO notifications (id, tenant_id, user_id, type, message, is_bot_sent) VALUES (?, ?, ?, 'wallet', ?, 1)");
        mysqli_stmt_bind_param($stmtNotif, "ssis", $notifId, $this->tenantId, $userObj['id'], $message);
        mysqli_stmt_execute($stmtNotif);
        mysqli_stmt_close($stmtNotif);

        $this->json([
            "status" => "success",
            "message" => "Invoice payment credited instantly to user ledger",
            "reference" => $ref
        ]);
    }
}
