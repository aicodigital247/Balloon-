<?php
/**
 * BattleArena SaaS App coordinator
 */

namespace App\Core;

class App {
    public static function getEnv(): string {
        return getenv('APP_ENV') ?: 'production';
    }
}
