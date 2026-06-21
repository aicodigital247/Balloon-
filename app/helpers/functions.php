<?php
/**
 * Global procedural helper functions
 */

if (!function_exists('config')) {
    function config(string $key, $default = null) {
        $parts = explode('.', $key);
        $file = array_shift($parts);
        $path = dirname(__DIR__) . "/config/{$file}.php";
        
        if (!file_exists($path)) {
            return $default;
        }
        
        $config = require $path;
        foreach ($parts as $part) {
            if (!isset($config[$part])) {
                return $default;
            }
            $config = $config[$part];
        }
        return $config;
    }
}

if (!function_exists('env')) {
    function env(string $key, $default = null) {
        $val = getenv($key);
        return $val !== false ? $val : $default;
    }
}
