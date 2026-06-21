<?php
/**
 * Cron Job: Release Room Codes for Scheduled Matches
 */

declare(strict_types=1);

require_once __DIR__ . '/../index.php';

use App\Core\Database;

try {
    $db = Database::getConnection();
    
    // Automatically release dummy lobby codes for upcoming matches running within next 10 mins
    $randomRoom = 'LOBBY-' . mt_rand(1000, 9999);
    $stmt = mysqli_prepare($db, "
        UPDATE tournaments 
        SET status = 'room_released', room_code = ? 
        WHERE status = 'upcoming' AND scheduled_time LIKE '%now%'
    ");
    mysqli_stmt_bind_param($stmt, "s", $randomRoom);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    echo "CRON SUCCESS: Match codes issued." . PHP_EOL;
} catch (\Throwable $t) {
    echo "CRON FAILURE: " . $t->getMessage() . PHP_EOL;
}
