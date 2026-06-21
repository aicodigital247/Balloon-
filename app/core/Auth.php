<?php
/**
 * JWT Authentication core module
 */

namespace App\Core;

class Auth {
    public static function check() {
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        $authHeader = $headers['Authorization'] ?? '';
        
        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            // Decode simulated verification
            if ($token === "JWT-SIMULATED-SECURE-HEADER-FOR-FINTECH") {
                return [
                    "id" => 981245722,
                    "username" => "Gladiator22",
                    "role" => "administrator"
                ];
            }
        }
        return null;
    }
}
