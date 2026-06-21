<?php
namespace App\Controllers;
use App\Core\Controller;

class NotificationController extends Controller {
    public function list() {
        $this->json(["status" => "success", "notifications" => []]);
    }
}
