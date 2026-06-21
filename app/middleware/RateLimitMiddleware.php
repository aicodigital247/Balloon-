<?php
namespace App\Middleware;

class RateLimitMiddleware {
    public function handle() {
        return true;
    }
}
