<?php
/**
 * BattleArena Router - Highly optimized Custom Route Manager
 */

namespace App\Core;

class Router {
    private $routes = [];
    private $tenantId;

    public function __construct() {
        // Detect current SaaS tenant subdomain or custom security header
        $headers = function_exists('getallheaders') ? getallheaders() : [];
        if (isset($headers['X-Tenant-Group'])) {
            $this->tenantId = trim($headers['X-Tenant-Group']);
        } else {
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $parts = explode('.', $host);
            // Multi-Tenant subdomain (e.g., ghana.battlearena.gg -> ba_ghana)
            if (count($parts) > 2) {
                $this->tenantId = 'ba_' . trim($parts[0]);
            } else {
                $this->tenantId = 'ba_nigeria';
            }
        }
    }

    public function add($method, $path, $handler) {
        $this->routes[strtoupper($method)][$path] = $handler;
    }

    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        
        if (isset($this->routes[$method][$path])) {
            $handler = $this->routes[$method][$path];
            return $this->execute($handler);
        }

        // Return beautiful dynamic error response for unfound routes
        http_response_code(404);
        echo json_encode([
            "status" => "error", 
            "message" => "Route '{$path}' not found in BattleArena routing tables."
        ]);
        exit;
    }

    private function execute($handler) {
        list($controllerName, $action) = explode('@', $handler);
        $fullController = "\\App\\Controllers\\" . $controllerName;
        
        if (class_exists($fullController)) {
            $controllerInstance = new $fullController($this->tenantId);
            return $controllerInstance->$action();
        }
        
        http_response_code(500);
        echo json_encode([
            "status" => "error", 
            "message" => "Routing dispatcher failed to load target module: {$fullController}"
        ]);
        exit;
    }
}
