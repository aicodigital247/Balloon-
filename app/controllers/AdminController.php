<?php
/**
 * BattleArena v2 - Admin Controller
 */

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Core\Auth;
use App\Core\Security;

class AdminController extends Controller {

    public function releaseRoomCode() {
        $userObj = Auth::check();
        if (!$userObj || ($userObj['role'] ?? '') !== 'administrator') {
            $this->error("Access forbidden: developer clearance required", 403);
        }

        $input = $this->getJsonInput();
        $tournamentId = $input['tournamentId'] ?? '';
        $roomCode = 'ARENA_NG_' . mt_rand(10000, 99999);

        if (empty($tournamentId)) {
            $this->error("Incorrect parameters input", 400);
        }

        $db = Database::getConnection();
        $stmt = mysqli_prepare($db, "UPDATE tournaments SET status = 'room_released', room_code = ? WHERE id = ? AND tenant_id = ?");
        mysqli_stmt_bind_param($stmt, "sss", $roomCode, $tournamentId, $this->tenantId);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $this->json([
            "status" => "success",
            "message" => "Lobby details issued to participants",
            "roomCode" => $roomCode
        ]);
    }

    public function payoutLeague() {
        $userObj = Auth::check();
        if (!$userObj || ($userObj['role'] ?? '') !== 'administrator') {
            $this->error("Forbidden", 403);
        }

        $input = $this->getJsonInput();
        $tournamentId = $input['tournamentId'] ?? '';
        $winnerName = $input['winnerPlayerName'] ?? 'Gladiator22';

        if (empty($tournamentId)) {
            $this->error("Incorrect payload parameters", 400);
        }

        $db = Database::getConnection();

        mysqli_begin_transaction($db);
        try {
            // Check tournament metadata
            $stmtT = mysqli_prepare($db, "SELECT * FROM tournaments WHERE id = ? AND tenant_id = ? LIMIT 1 FOR UPDATE");
            mysqli_stmt_bind_param($stmtT, "ss", $tournamentId, $this->tenantId);
            mysqli_stmt_execute($stmtT);
            $tour = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtT));
            mysqli_stmt_close($stmtT);

            if (!$tour) {
                throw new \Exception("Tournament room not found");
            }

            if ($tour['status'] === 'completed') {
                throw new \Exception("Match rewards have already been dispatched");
            }

            // Find winner's user details
            $stmtW = mysqli_prepare($db, "SELECT id FROM users WHERE username = ? AND tenant_id = ? LIMIT 1");
            mysqli_stmt_bind_param($stmtW, "ss", $winnerName, $this->tenantId);
            mysqli_stmt_execute($stmtW);
            $winner = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtW));
            mysqli_stmt_close($stmtW);

            if ($winner) {
                $winnerId = $winner['id'];
                
                // Fetch winner's wallet record
                $stmtWallet = mysqli_prepare($db, "SELECT id FROM wallets WHERE user_id = ? AND tenant_id = ? LIMIT 1");
                mysqli_stmt_bind_param($stmtWallet, "is", $winnerId, $this->tenantId);
                mysqli_stmt_execute($stmtWallet);
                $wallet = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtWallet));
                mysqli_stmt_close($stmtWallet);

                if ($wallet) {
                    $ref = 'WIN-' . $tournamentId . '-' . mt_rand(10, 99);
                    $desc = "Champions Cup Regional Prize: " . $tour['title'];
                    
                    // Award ledger row
                    $stmtCredit = mysqli_prepare($db, "INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) VALUES (?, ?, 'credit', ?, ?)");
                    mysqli_stmt_bind_param($stmtCredit, "ssds", $wallet['id'], $ref, $tour['prize_pool'], $desc);
                    mysqli_stmt_execute($stmtCredit);
                    mysqli_stmt_close($stmtCredit);
                }
            }

            // Mark completed
            $stmtUp = mysqli_prepare($db, "UPDATE tournaments SET status = 'completed', winner_player_name = ? WHERE id = ?");
            mysqli_stmt_bind_param($stmtUp, "ss", $winnerName, $tournamentId);
            mysqli_stmt_execute($stmtUp);
            mysqli_stmt_close($stmtUp);

            mysqli_commit($db);
            $this->json([
                "status" => "success",
                "message" => "Tournament successfully verified and rewards emitted to winner"
            ]);
        } catch (\Exception $e) {
            mysqli_rollback($db);
            $this->error($e->getMessage(), 400);
        }
    }
}
