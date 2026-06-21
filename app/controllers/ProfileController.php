<?php
namespace App\Controllers;
use App\Core\Controller;

class ProfileController extends Controller {
    public function view() {
        $this->json(["status" => "success", "profile" => []]);
    }
}
