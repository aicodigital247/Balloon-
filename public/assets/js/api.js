/**
 * API Fetch Wrapper
 */
window.BattleArenaAPI = {
    async fetch(endpoint, opts = {}) {
        const response = await fetch('/api' + endpoint, opts);
        return response.json();
    }
};
