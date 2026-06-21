<?php
namespace App\Controllers;
use App\Core\Controller;

class WithdrawalController extends Controller {
    public function payout() {
        $this->json(["status" => "success", "payout" => "initiated"]);
    }
}
