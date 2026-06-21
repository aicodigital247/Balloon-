<?php
namespace App\Controllers;
use App\Core\Controller;

class SupportController extends Controller {
    public function view() {
        $this->json(["status" => "success", "support_tickets" => []]);
    }
}
