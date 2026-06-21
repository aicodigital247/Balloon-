<?php
/**
 * Security & Anti-Fraud Config
 */

return [
    'rate_limit' => [
        'requests' => 60,
        'window' => 60, // 60 requests per minute
    ],
    'allowed_origins' => [
        'https://arena.battlearena.gg',
        'https://t.me', // Raw telegram bot embeds
    ],
    'hmac_algorithm' => 'sha256',
    'require_ssl' => true,
    'input_sanitize_filters' => [
        'username' => '/^[a-zA-Z0-9_]{3,30}$/',
        'room_code' => '/^[A-Z0-9_\\-]{3,50}$/i'
    ]
];
