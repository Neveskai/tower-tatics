import CrashlyticsService from "@/common/providers/crashlytics";
import React from "react";

type iProps = { children: React.ReactNode };

type iError = { hasError: boolean };

export class ErrorBoundary extends React.Component<iProps, iError> {
  constructor(props: iProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    CrashlyticsService.recordError(error);
    CrashlyticsService.log(`React stack: ${info.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return <div>Oops! Algo deu errado.</div>;
    }

    return this.props.children;
  }
}
