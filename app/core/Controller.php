<?php
/**
 * BattleArena v2 - Base Controller
 */

namespace App\Core;

abstract class Controller {
    protected $tenantId;

    public function __construct(string $tenantId) {
        $this->tenantId = $tenantId;
    }

    /**
     * Get JSON inputs securely
     */
    protected function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?: [];
    }

    /**
     * Respond in standard JSON
     */
    protected function json(array $data, int $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    /**
     * Respond with standard JSON error
     */
    protected function error(string $message, int $statusCode = 400) {
        $this->json([
            "status" => "error",
            "message" => $message
        ], $statusCode);
    }
}
