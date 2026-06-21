<?php
/**
 * BattleArena Input Validator
 */

namespace App\Core;

class Validator {
    public static function validateAmount($amount): bool {
        return is_numeric($amount) && floatval($amount) > 0;
    }

    public static function validateUsername(string $username): bool {
        return preg_match('/^[a-zA-Z0-9_-]{3,30}$/', $username) === 1;
    }

    public static function cleanString(string $data): string {
        return htmlspecialchars(strip_tags(trim($data)));
    }
}
