<?php
/**
 * BattleArena Cache wrapper
 */

namespace App\Core;

class Cache {
    public static function get($key) { return null; }
    public static function set($key, $value, $ttl = 300) { return true; }
}
