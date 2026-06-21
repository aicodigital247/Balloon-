<?php
/**
 * Multi-Tenant Regional configurations
 */

return [
    'available_tenants' => explode(',', getenv('AVAILABLE_TENANTS') ?: 'ba_nigeria,ba_ghana,ba_kenya,ba_south_africa'),
    'default_tenant' => getenv('DEFAULT_TENANT') ?: 'ba_nigeria',
    'tenants' => [
        'ba_nigeria' => [
            'name' => 'BattleArena Nigeria',
            'country' => 'Nigeria',
            'currency' => 'NGN',
            'symbol' => '₦',
            'multiplier' => 1000.00,
            'deposit_methods' => ['monnify', 'paystack']
        ],
        'ba_ghana' => [
            'name' => 'BattleArena Ghana',
            'country' => 'Ghana',
            'currency' => 'GHS',
            'symbol' => '₵',
            'multiplier' => 10.00,
            'deposit_methods' => ['paystack']
        ],
        'ba_kenya' => [
            'name' => 'BattleArena Kenya',
            'country' => 'Kenya',
            'currency' => 'KES',
            'symbol' => 'Ksh',
            'multiplier' => 100.00,
            'deposit_methods' => ['flutterwave']
        ],
        'ba_south_africa' => [
            'name' => 'BattleArena South Africa',
            'country' => 'South Africa',
            'currency' => 'ZAR',
            'symbol' => 'R',
            'multiplier' => 15.00,
            'deposit_methods' => ['paystack', 'flutterwave']
        ]
    ]
];
