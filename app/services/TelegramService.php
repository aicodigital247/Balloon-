<?php
/**
 * Telegram Message Dispatcher Service
 */

namespace App\Services;

class TelegramService {
    private $botToken;

    public function __construct() {
        $this->botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '740242965888:AAEgladiatorSecretToken';
    }

    public function sendMessage(string $chatId, string $message): bool {
        if (empty($chatId)) return false;
        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
        $data = [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML'
        ];

        // Guzzle HTTP simulation or standard cURL connection
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $res = curl_exec($ch);
        curl_close($ch);
        
        return $res !== false;
    }
}
