import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";

export default class CrashlyticsService {
  static log(message: string) {
    FirebaseCrashlytics.log({ message }).catch(console.warn);
  }

  static setUserId(userId: string) {
    FirebaseCrashlytics.setUserId({ userId }).catch(console.warn);
  }

  static setCustomKey(key: string, value: string | number | boolean) {
    let type: "string" | "boolean" | "int" | "double";

    if (typeof value === "string") type = "string";
    else if (typeof value === "boolean") type = "boolean";
    else if (Number.isInteger(value)) type = "int";
    else type = "double";

    FirebaseCrashlytics.setCustomKey({
      key,
      value,
      type,
    }).catch(console.warn);
  }

  static recordError(error: unknown) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}\n${error.stack}`
        : typeof error === "string"
        ? error
        : JSON.stringify(error);

    FirebaseCrashlytics.recordException({ message }).catch(console.warn);
  }

  static initGlobalErrorListeners() {
    window.onerror = (message, source, lineno, colno, error) => {
      const msg = `[onerror] ${message} at ${source}:${lineno}:${colno}`;
      this.recordError(error || msg);
    };

    window.onunhandledrejection = (event) => {
      const reason = event.reason;
      const msg =
        reason instanceof Error
          ? `[unhandledrejection] ${reason.message}\n${reason.stack}`
          : `[unhandledrejection] ${JSON.stringify(reason)}`;

      this.recordError(msg);
    };

    this.log("Crashlytics global error listeners initialized");
  }
}
