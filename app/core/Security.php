<?php
/**
 * Core Security Helpers
 */

namespace App\Core;

class Security {
    public static function escape($data) {
        $db = Database::getConnection();
        if (is_array($data)) {
            return array_map([self::class, 'escape'], $data);
        }
        return mysqli_real_escape_string($db, trim((string)$data));
    }

    public static function generateUUID(): string {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
