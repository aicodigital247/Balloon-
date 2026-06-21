<?php
/**
 * BattleArena v2 - Wallet & Ledger Implementation
 */

namespace App\Services;

use App\Config\Database;

class WalletService {
    private $db;
    private $tenantId;

    public function __construct(string $tenantId) {
        $this->db = Database::getInstance();
        $this->tenantId = $tenantId;
    }

    /**
     * Immutable Balance Check: SUM(credits) - SUM(debits)
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
     * Add Ledger Entry (Credit/Debit atomic event)
     */
    public function transact(string $walletId, float $amount, string $type, string $description, ?string $ref = null) {
        if ($amount <= 0) {
            throw new \Exception("Fintech standard: positive transaction values only");
        }
        
        if ($type !== 'credit' && $type !== 'debit') {
            throw new \Exception("Invalid transaction type direction");
        }

        $reference = $ref ?: 'BA-LEDG-' . uniqid() . '-' . mt_rand(1000, 9999);

        mysqli_begin_transaction($this->db);
        
        try {
            if ($type === 'debit') {
                $currentBalance = $this->getBalance($walletId);
                if ($currentBalance < $amount) {
                    throw new \Exception("Insufficient funds in target ledger");
                }
            }

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
        } catch (\Exception $e) {
            mysqli_rollback($this->db);
            throw $e;
        }
    }
}
