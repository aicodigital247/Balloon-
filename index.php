<?php
/**
 * BattleArena v2 - Main Bootstrap Entry & Routing Gate
 * Designed for High-Performance multi-tenant SaaS.
 */

declare(strict_types=1);

// Enable CORS for API connections
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Tenant-Group");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Load Composer Autoloader
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    // Basic fallback autoloader for non-vendor execution environments
    spl_autoload_register(function ($class) {
        $prefix = 'App\\';
        $base_dir = __DIR__ . '/app/';

        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }

        $relative_class = substr($class, $len);
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    });
}

// 2. Load Helpers and Basic procedural helpers
if (file_exists(__DIR__ . '/app/helpers/functions.php')) {
    require_once __DIR__ . '/app/helpers/functions.php';
}

// 3. Simple Environment file parser fallback if Dotenv isn't fully initialized
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2) + [NULL, NULL];
        if ($name !== NULL) {
            $name = trim($name);
            $value = trim($value);
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
        }
    }
}

// 4. Dispatch Web Requests
try {
    // Boot the custom Express-style PHP routing pipeline
    $router = new \App\Core\Router();
    
    // Require routing definitions
    if (file_exists(__DIR__ . '/routes.php')) {
        require_once __DIR__ . '/routes.php';
    }
    
    $router->dispatch();
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Critical SaaS Bootstrap Failure",
        "debug" => [
            "class" => get_class($e),
            "error" => $e->getMessage(),
            "trace" => $e->getTraceAsString()
        ]
    ]);
}
