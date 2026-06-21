<?php
/**
 * BattleArena v2 - Base Model representation
 */

namespace App\Core;

class Model {
    protected $db;
    protected $table;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function find($id) {
        $stmt = mysqli_prepare($this->db, "SELECT * FROM {$this->table} WHERE id = ? LIMIT 1");
        mysqli_stmt_bind_param($stmt, "s", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);
        return $row;
    }
}
