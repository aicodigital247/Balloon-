<?php
namespace App\Controllers;
use App\Core\Controller;

class AchievementController extends Controller {
    public function view() {
        $this->json(["status" => "success", "achievements" => []]);
    }
}
