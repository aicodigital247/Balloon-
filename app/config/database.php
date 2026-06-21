<?php
/**
 * BattleArena v2 - MySQLi Core Database Config
 * Multi-Tenant Scoped Connections & Singleton Pattern
 */

namespace App\Config;

class Database {
    private static $instance = null;
    private $conn;
    
    private function __construct() {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $user = getenv('DB_USER') ?: 'battle_user';
        $pass = getenv('DB_PASS') ?: 'secure_fin_pass';
        $name = getenv('DB_NAME') ?: 'battlearena_db';
        $port = (int)(getenv('DB_PORT') ?: 3306);

        // Standard PHP MySQLi connector extension
        $this->conn = mysqli_init();
        if (!$this->conn) {
            throw new \Exception("MySQLi initialization failed");
        }

        if (!@mysqli_real_connect($this->conn, $host, $user, $pass, $name, $port)) {
            throw new \Exception("Database connection failed: " . mysqli_connect_error());
        }

        mysqli_set_charset($this->conn, "utf8mb4");
    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance->getConnection();
    }

    public function getConnection() {
        return $this->conn;
    }
}
