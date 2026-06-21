<?php
/**
 * SaaS Helpers
 */

function resolve_tenant_prefix(string $tenantId): string {
    return str_replace('ba_', '', $tenantId);
}
