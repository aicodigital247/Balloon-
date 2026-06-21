<?php
/**
 * BattleArena v2 - System Response manager
 */

namespace App\Core;

class Response {
    public static function send($data, $status = 200, $headers = []) {
        foreach ($headers as $key => $val) {
            header("$key: $val");
        }
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}
