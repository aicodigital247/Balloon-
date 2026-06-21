<?php
namespace App\Controllers;
use App\Core\Controller;

class MatchController extends Controller {
    public function index() {
        $this->json(["status" => "success", "matches" => []]);
    }
}
