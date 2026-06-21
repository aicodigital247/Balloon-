/**
 * Vanilla Frontend SPA Router
 */
class FrontendRouter {
    navigate(path) {
        console.log("Navigating in-app path: " + path);
    }
}
window.FrontendRouter = new FrontendRouter();
