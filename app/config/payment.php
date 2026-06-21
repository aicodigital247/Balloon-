<?php
/**
 * Payment Gateways Configurations
 */

return [
    'default' => 'paystack',
    'monnify' => [
        'api_key' => getenv('MONNIFY_API_KEY') ?: '',
        'contract_code' => getenv('MONNIFY_CONTRACT_CODE') ?: '',
        'base_url' => 'https://api.monnify.com',
    ],
    'paystack' => [
        'secret_key' => getenv('PAYSTACK_SECRET_KEY') ?: '',
        'base_url' => 'https://api.paystack.co',
    ],
    'flutterwave' => [
        'secret_key' => getenv('FLUTTERWAVE_SECRET_KEY') ?: '',
        'base_url' => 'https://api.flutterwave.com/v3',
    ]
];
