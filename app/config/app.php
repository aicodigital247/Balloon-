<?php
/**
 * Global App Configurations
 */

return [
    'name' => 'BattleArena Enterprise',
    'env' => getenv('APP_ENV') ?: 'production',
    'debug' => filter_var(getenv('APP_DEBUG') ?: false, FILTER_VALIDATE_BOOLEAN),
    'url' => getenv('APP_URL') ?: 'https://arena.battlearena.gg',
    'timezone' => 'UTC',
    'locale' => 'en',
    'version' => '2.4.0',
];
