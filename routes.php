<?php
/**
 * BattleArena v2 - Central Application Routes
 * Defines API routing tables for multi-tenant controllers.
 */

use App\Core\Router;

if (!isset($router)) {
    throw new \Exception("Router not initialized inside routing gate context");
}

// Authentication endpoints
$router->add('POST', '/api/auth/telegram', 'AuthController@verifyTelegram');
$router->add('GET', '/api/auth/session', 'AuthController@checkSession');

// Tournament listings and registrations 
$router->add('GET', '/api/tournaments', 'TournamentController@listActive');
$router->add('POST', '/api/tournaments/register', 'TournamentController@register');
$router->add('GET', '/api/tournaments/history', 'TournamentController@logs');

// Team configurations
$router->add('GET', '/api/teams', 'TeamController@index');
$router->add('POST', '/api/teams/create', 'TeamController@create');
$router->add('POST', '/api/teams/join', 'TeamController@join');

// Fintech Ledger and balances
$router->add('GET', '/api/wallet/balance', 'WalletController@getBalance');
$router->add('GET', '/api/wallet/ledger', 'WalletController@getLedger');
$router->add('POST', '/api/wallet/deposit', 'DepositController@initiate');
$router->add('POST', '/api/wallet/withdraw', 'WithdrawalController@payout');

// Leaderboard and Referrals
$router->add('GET', '/api/leaderboard', 'LeaderboardController@rankings');
$router->add('GET', '/api/referrals', 'ReferralController@summary');

// Admin and Cron Triggers (Authenticated backends)
$router->add('POST', '/api/admin/release-room', 'AdminController@releaseRoomCode');
$router->add('POST', '/api/admin/payout-tournament', 'AdminController@payoutLeague');
$router->add('POST', '/api/admin/cron-trigger', 'AdminController@triggerCronJob');
