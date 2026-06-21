<?php
/**
 * BattleArena v2 - Telegram HMAC Cryptographic Verifier
 */

namespace App\Core;

class TelegramAuth {
    public static function verify(string $initData, string $botToken): ?array {
        if (empty($initData)) return null;

        $rawData = explode('&', $initData);
        $authData = [];
        foreach ($rawData as $item) {
            if (strpos($item, '=') !== false) {
                list($key, $val) = explode('=', $item, 2);
                $authData[$key] = urldecode($val);
            }
        }

        if (!isset($authData['hash'])) return null;

        $hash = $authData['hash'];
        unset($authData['hash']);
        ksort($authData);

        $dataCheckArray = [];
        foreach ($authData as $key => $value) {
            $dataCheckArray[] = "{$key}={$value}";
        }
        $dataCheckString = implode("\n", $dataCheckArray);

        // Crypto confirmation
        $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
        $computedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

        if (hash_equals($hash, $computedHash)) {
            $userJson = json_decode($authData['user'] ?? '{}', true);
            return $userJson;
        }

        return null;
    }
}
