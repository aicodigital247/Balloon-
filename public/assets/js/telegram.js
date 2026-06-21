/**
 * Telegram WebApp Integration SDK
 */
window.TelegramWebApp = {
    getInitData() {
        return window.Telegram?.WebApp?.initData || "";
    }
};
