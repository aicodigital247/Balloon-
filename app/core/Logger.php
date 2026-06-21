<?php
/**
 * BattleArena Log System
 */

namespace App\Core;

class Logger {
    public static function info(string $msg, array $ctx = []) {
        $logFile = dirname(__DIR__, 2) . '/storage/logs/app.log';
        $logDir = dirname($logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true);
        }
        $line = "[" . date('H:i:s') . "] INFO: " . $msg . " " . json_encode($ctx) . PHP_EOL;
        file_put_contents($logFile, $line, FILE_APPEND);
    }
}
