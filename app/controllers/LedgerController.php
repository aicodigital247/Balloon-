<?php
namespace App\Controllers;
use App\Core\Controller;

class LedgerController extends Controller {
    public function index() {
        $this->json(["status" => "success", "ledger" => []]);
    }
}
