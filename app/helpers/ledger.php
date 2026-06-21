<?php
/**
 * Ledger Helpers
 */

function generate_reference(): string {
    return 'BA-LEDG-CR-' . mt_rand(100000, 999999);
}
