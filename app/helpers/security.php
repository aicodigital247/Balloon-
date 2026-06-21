<?php
/**
 * Security Helpers
 */

function secure_hash(string $data): string {
    return hash('sha256', $data);
}
