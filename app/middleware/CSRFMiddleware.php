<?php
namespace App\Middleware;

class CSRFMiddleware {
    public function handle() {
        return true;
    }
}
