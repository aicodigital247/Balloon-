<?php
/**
 * Telegram Bot & WebApp Configurations
 */

return [
    'bot_token' => getenv('TELEGRAM_BOT_TOKEN') ?: '740242965888:AAEgladiatorSecretToken',
    'bot_username' => getenv('TELEGRAM_BOT_USERNAME') ?: 'BattleArenaSaaSRegionalBot',
    'webhook_url' => (getenv('APP_URL') ?: 'https://arena.battlearena.gg') . '/api/notifications/telegram-webhook',
    'verification_algorithm' => 'WebAppData',
    'user_session_expiry' => 86400, // 24 hours
];
