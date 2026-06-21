<?php
/**
 * Telegram Helpers
 */

function clean_telegram_username(string $uname): string {
    return ltrim(trim($uname), '@');
}
