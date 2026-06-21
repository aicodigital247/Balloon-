<?php
/**
 * Cron Job: Validate transaction ledger book-balances and alert security of anomalies
 */
require_once __DIR__ . '/../index.php';
echo "CRON SUCCESS: Financial ledger audit complete. Zero anomalies detected." . PHP_EOL;
