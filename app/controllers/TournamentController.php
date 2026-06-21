<?php
/**
 * BattleArena v2 - Tournament Controller
 */

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Core\Auth;
use App\Core\Security;

class TournamentController extends Controller {

    /**
     * List active regional matches
     */
    public function listActive() {
        $db = Database::getConnection();
        $stmt = mysqli_prepare($db, "SELECT * FROM tournaments WHERE tenant_id = ? ORDER BY created_at DESC");
        mysqli_stmt_bind_param($stmt, "s", $this->tenantId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        $list = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $list[] = [
                "id" => $row['id'],
                "tenantId" => $row['tenant_id'],
                "title" => $row['title'],
                "gameName" => $row['game_name'],
                "entryFee" => (float)$row['entry_fee'],
                "prizePool" => (float)$row['prize_pool'],
                "currentParticipants" => (int)$row['current_participants'],
                "maxParticipants" => (int)$row['max_participants'],
                "status" => $row['status'],
                "description" => $row['description'] ?? '',
                "roomCode" => $row['room_code'],
                "scheduledTime" => $row['scheduled_time']
            ];
        }
        mysqli_stmt_close($stmt);

        $this->json($list);
    }

    /**
     * Register self to an active regional cup match
     */
    public function register() {
        $userObj = Auth::check();
        if (!$userObj) {
            $this->error("Unauthorized session key", 401);
        }

        $input = $this->getJsonInput();
        $tournamentId = $input['tournamentId'] ?? '';
        $feeAmount = (float)($input['entryFee'] ?? 0);

        if (empty($tournamentId) || $feeAmount < 0) {
            $this->error("Incorrect parameter payload", 400);
        }

        $db = Database::getConnection();
        
        mysqli_begin_transaction($db);
        try {
            // Find match details
            $stmtTour = mysqli_prepare($db, "SELECT * FROM tournaments WHERE id = ? AND tenant_id = ? LIMIT 1 FOR UPDATE");
            mysqli_stmt_bind_param($stmtTour, "ss", $tournamentId, $this->tenantId);
            mysqli_stmt_execute($stmtTour);
            $tour = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtTour));
            mysqli_stmt_close($stmtTour);

            if (!$tour) {
                throw new \Exception("Match record matching ID not found on this tenant nodes");
            }

            if ($tour['current_participants'] >= $tour['max_participants']) {
                throw new \Exception("Tournament room is fully booked");
            }

            // Find User Wallet ID
            $stmtWallet = mysqli_prepare($db, "SELECT id FROM wallets WHERE user_id = ? AND tenant_id = ? LIMIT 1");
            mysqli_stmt_bind_param($stmtWallet, "is", $userObj['id'], $this->tenantId);
            mysqli_stmt_execute($stmtWallet);
            $wallet = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtWallet));
            mysqli_stmt_close($stmtWallet);

            if (!$wallet) {
                throw new \Exception("Tenant wallet ledger not configured for this user ID");
            }

            $walletId = $wallet['id'];

            // Recalculate Live Sum Balance to verify sufficient credit
            $stmtBalance = mysqli_prepare($db, "
                SELECT COALESCE(SUM(CASE WHEN type = 'credit' THEN amount ELSE -amount END), 0) as balance 
                FROM wallet_ledger 
                WHERE wallet_id = ?
            ");
            mysqli_stmt_bind_param($stmtBalance, "s", $walletId);
            mysqli_stmt_execute($stmtBalance);
            $balanceRow = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtBalance));
            mysqli_stmt_close($stmtBalance);

            $currentBalance = (float)($balanceRow['balance'] ?? 0.0);
            if ($currentBalance < $tour['entry_fee']) {
                throw new \Exception("Insufficient balance on ledger to trigger match authorization");
            }

            // Book transaction
            $reference = 'REG-' . $tournamentId . '-' . mt_rand(10, 99);
            $chargeDesc = "Match Entry Stake Fee: " . $tour['title'];
            $stmtDebit = mysqli_prepare($db, "INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES (?, ?, 'debit', ?, ?)");
            mysqli_stmt_bind_param($stmtDebit, "ssds", $walletId, $reference, $tour['entry_fee'], $chargeDesc);
            mysqli_stmt_execute($stmtDebit);
            mysqli_stmt_close($stmtDebit);

            // Increment participant counts
            $stmtInc = mysqli_prepare($db, "UPDATE tournaments SET current_participants = current_participants + 1 WHERE id = ?");
            mysqli_stmt_bind_param($stmtInc, "s", $tournamentId);
            mysqli_stmt_execute($stmtInc);
            mysqli_stmt_close($stmtInc);

            mysqli_commit($db);
            $this->json([
                "status" => "success",
                "message" => "Successfully registered for regional match",
                "reference" => $reference
            ]);
        } catch (\Exception $e) {
            mysqli_rollback($db);
            $this->error($e->getMessage(), 400);
        }
    }
}
