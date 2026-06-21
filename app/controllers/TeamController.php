<?php
namespace App\Controllers;
use App\Core\Controller;
use App\Core\Database;

class TeamController extends Controller {
    public function index() {
        $db = Database::getConnection();
        $stmt = mysqli_prepare($db, "SELECT * FROM teams WHERE tenant_id = ?");
        mysqli_stmt_bind_param($stmt, "s", $this->tenantId);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $teams = [];
        while ($row = mysqli_fetch_assoc($res)) {
            $teams[] = [
                "id" => $row['id'],
                "name" => $row['name'],
                "logoUrl" => $row['logo_url'],
                "memberNames" => json_decode($row['member_names'] ?? '[]', true)
            ];
        }
        mysqli_stmt_close($stmt);
        $this->json($teams);
    }

    public function create() {
        $input = $this->getJsonInput();
        $name = $input['name'] ?? '';
        if (empty($name)) {
            $this->error("Clan name is required", 400);
        }

        $db = Database::getConnection();
        $teamId = 'team_' . mt_rand(1000, 9999);
        $members = json_encode(['Gladiator22']);
        $stmt = mysqli_prepare($db, "INSERT INTO teams (id, tenant_id, name, member_names, leader_id) VALUES (?, ?, ?, ?, 981245722)");
        mysqli_stmt_bind_param($stmt, "ssss", $teamId, $this->tenantId, $name, $members);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        $this->json(["status" => "success", "message" => "Team created", "teamId" => $teamId]);
    }
}
