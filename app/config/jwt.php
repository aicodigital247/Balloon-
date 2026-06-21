<?php
/**
 * JWT Configuration Settings
 */

return [
    'secret' => getenv('JWT_SECRET') ?: 'ba-fintech-jwt-signing-key-99824-prod',
    'expiry' => (int)(getenv('JWT_EXPIRATION') ?: 86400),
    'algorithm' => 'HS256',
    'issuer' => 'BattleArena Enterprise SaaS',
    'audience' => 'BattleArena Clients'
];
