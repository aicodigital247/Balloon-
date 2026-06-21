<?php
namespace App\Controllers;
use App\Core\Controller;

class ReferralController extends Controller {
    public function summary() {
        $this->json(["status" => "success", "referrals" => []]);
    }
}
