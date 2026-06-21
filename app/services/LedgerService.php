<?php
/**
 * BattleArena v2 - Core Ledger Booking Engine
 * Fintech-grade double entry audit compliance wrapper
 */

namespace App\Services;

use App\Config\Database;

class LedgerService {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Get calculated current balance for a ledger account
     */
    public function getBalance(string $walletId): float {
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
     * Records a secure credit entry to the ledger book
     */
    public function credit(string $walletId, float $amount, string $reference, string $description): bool {
        if ($amount <= 0) {
            throw new \Exception("Fintech standard: positive transaction amounts only");
        }

        $stmt = mysqli_prepare($this->db, "
            INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) 
            VALUES (?, ?, 'credit', ?, ?)
        ");
        mysqli_stmt_bind_param($stmt, "ssds", $walletId, $reference, $amount, $description);
        $status = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        return $status;
    }

    /**
     * Records a secure debit entry to the ledger book with balance validation
     */
    public function debit(string $walletId, float $amount, string $reference, string $description): bool {
        if ($amount <= 0) {
            throw new \Exception("Fintech standard: positive transaction amounts only");
        }

        // Validate sufficient funds
        $currentBalance = $this->getBalance($walletId);
        if ($currentBalance < $amount) {
            throw new \Exception("Insufficient ledger funds to clear debit event");
        }

        $stmt = mysqli_prepare($this->db, "
            INSERT INTO wallet_ledger (wallet_id, reference, type, amount, description) 
            VALUES (?, ?, 'debit', ?, ?)
        ");
        mysqli_stmt_bind_param($stmt, "ssds", $walletId, $reference, $amount, $description);
        $status = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        return $status;
    }

    /**
     * Returns full ledger entries history for a wallet
     */
    public function getHistory(string $walletId, int $limit = 50): array {
        $stmt = mysqli_prepare($this->db, "
            SELECT id, reference, type, amount, description, created_at 
            FROM wallet_ledger 
            WHERE wallet_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ");
        mysqli_stmt_bind_param($stmt, "si", $walletId, $limit);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $history = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $history[] = [
                'id' => (int)$row['id'],
                'reference' => $row['reference'],
                'type' => $row['type'],
                'amount' => (float)$row['amount'],
                'description' => $row['description'],
                'created_at' => $row['created_at']
            ];
        }
        mysqli_stmt_close($stmt);
        return $history;
    }
}
