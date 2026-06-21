<?php
/**
 * Validator Helpers
 */

function is_clean_username(string $uname): bool {
    return preg_match('/^[a-zA-Z0-9_-]{3,30}$/', $uname) === 1;
}
