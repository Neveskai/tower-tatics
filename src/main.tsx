import { createRoot } from "react-dom/client";
import CrashlyticsService from "./common/providers/crashlytics";
import { isNativePlatform } from "./common/constants/responsivity.constants";
import Router from "./router";

const container = document.getElementById("react-root");
if (container) {
  createRoot(container).render(<Router />);
}

if (isNativePlatform) {
  CrashlyticsService.initGlobalErrorListeners();
}
