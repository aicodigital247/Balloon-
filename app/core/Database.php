<?php
/**
 * Database Entrypoint singleton representation mapping Database core configuration metrics.
 */

namespace App\Core;

use App\Config\Database as ConfigDb;

class Database {
    public static function getConnection() {
        return ConfigDb::getInstance();
    }
    
    public static function query(string $sql, array $params = []) {
        $db = self::getConnection();
        if (empty($params)) {
            $result = mysqli_query($db, $sql);
            if (!$result) {
                throw new \Exception("Database query error: " . mysqli_error($db));
            }
            return $result;
        }
        
        $stmt = mysqli_prepare($db, $sql);
        if (!$stmt) {
            throw new \Exception("Query preparation failed: " . mysqli_error($db));
        }
        
        $types = "";
        $bindParams = [];
        foreach ($params as $param) {
            if (is_int($param)) {
                $types .= "i";
            } elseif (is_double($param)) {
                $types .= "d";
            } else {
                $types .= "s";
            }
            $bindParams[] = $param;
        }
        
        mysqli_stmt_bind_param($stmt, $types, ...$bindParams);
        if (!mysqli_stmt_execute($stmt)) {
            throw new \Exception("Query execution failed: " . mysqli_stmt_error($stmt));
        }
        
        $result = mysqli_stmt_get_result($stmt);
        mysqli_stmt_close($stmt);
        return $result;
    }
}
