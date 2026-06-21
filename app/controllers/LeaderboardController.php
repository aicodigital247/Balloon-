<?php
namespace App\Controllers;
use App\Core\Controller;

class LeaderboardController extends Controller {
    public function rankings() {
        $this->json(["status" => "success", "leaderboard" => []]);
    }
}
