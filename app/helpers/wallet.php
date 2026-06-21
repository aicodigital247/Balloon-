<?php
/**
 * Wallet Helpers
 */

function format_currency(float $amount, string $symbol): string {
    return $symbol . number_format($amount, 2);
}
