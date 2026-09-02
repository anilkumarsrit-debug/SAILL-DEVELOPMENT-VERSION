import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, MessageSquare, CheckCircle2, X } from 'lucide-react';

export interface GlobalErrorBoundaryProps {
  children: ReactNode;
  onNavigateHome?: () => void;
}

export interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showReportModal: boolean;
  reportSubmitted: boolean;
  reportNotes: string;
}

export class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showReportModal: false,
      reportSubmitted: false,
      reportNotes: ''
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('SAILL Global Error Boundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  private handleSubmitReport = (e: React.FormEvent): void => {
    e.preventDefault();
    this.setState({ reportSubmitted: true });
    setTimeout(() => {
      this.setState({ showReportModal: false, reportSubmitted: false, reportNotes: '' });
    }, 2000);
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-white rounded-3xl border-2 border-[#FAD7A0] shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
            {/* Header Icon */}
            <div className="flex items-center gap-4 border-b border-[#FFF8F0] pb-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                <AlertTriangle className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
                  System Recovery Mode
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#2C3E50] mt-1">
                  Something Went Wrong
                </h1>
                <p className="text-xs text-[#5D6D7E] font-medium">
                  SAILL encountered an unexpected display issue. Your progress and recordings are safe.
                </p>
              </div>
            </div>

            {/* Error Details Accordion / Summary */}
            <div className="p-4 rounded-2xl bg-[#FFF8F0]/60 border border-[#FAD7A0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#2C3E50]">
                <span>Diagnostic Information</span>
                <span className="font-mono text-[10px] text-[#D35400]">
                  {this.state.error?.name || 'Error'}
                </span>
              </div>
              <p className="text-xs font-mono text-rose-700 bg-rose-50/80 p-3 rounded-xl border border-rose-200 break-words">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-3 px-4 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2 min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:flex-1 py-3 px-4 bg-[#2C3E50] hover:bg-[#34495E] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2C3E50] focus:ring-offset-2 min-h-[44px]"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Go to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => this.setState({ showReportModal: true })}
                className="w-full sm:w-auto py-3 px-4 bg-[#FFF8F0] hover:bg-[#FAD7A0]/50 border border-[#FAD7A0] text-[#D35400] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                <span>Report Issue</span>
              </button>
            </div>

            {/* Footer Notice */}
            <p className="text-[11px] text-center text-[#5D6D7E]">
              Srinivasa Ramanujan Institute of Technology &bull; SAILL R26 AI Laboratory Platform
            </p>
          </div>

          {/* REPORT ISSUE MODAL */}
          {this.state.showReportModal && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn"
              role="dialog"
              aria-labelledby="report-issue-title"
              aria-modal="true"
            >
              <div className="bg-white rounded-3xl border-2 border-[#FAD7A0] max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => this.setState({ showReportModal: false })}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition"
                  aria-label="Close report dialog"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-center text-[#D35400]">
                    <MessageSquare className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="report-issue-title" className="text-lg font-bold text-[#2C3E50]">
                      Report System Issue
                    </h2>
                    <p className="text-xs text-[#5D6D7E]">
                      Help our SRIT engineering team improve laboratory resilience.
                    </p>
                  </div>
                </div>

                {this.state.reportSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" aria-hidden="true" />
                    <h3 className="font-bold text-emerald-900 text-sm">Report Logged Successfully</h3>
                    <p className="text-xs text-emerald-700">
                      Thank you! Diagnostic details have been submitted to SAILL System Audit.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={this.handleSubmitReport} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="issue-notes" className="block text-xs font-bold text-[#2C3E50]">
                        Describe what you were doing when the issue occurred (Optional):
                      </label>
                      <textarea
                        id="issue-notes"
                        rows={3}
                        value={this.state.reportNotes}
                        onChange={(e) => this.setState({ reportNotes: e.target.value })}
                        placeholder="e.g. Recorded audio in Pronunciation Studio Level 3..."
                        className="w-full p-3 rounded-xl border border-[#FAD7A0] bg-[#FFF8F0]/40 text-xs text-[#2C3E50] focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] font-mono text-gray-600 space-y-1">
                      <div className="font-bold text-gray-800">Auto-captured telemetry:</div>
                      <div>URL: {window.location.pathname}</div>
                      <div>Timestamp: {new Date().toLocaleTimeString()}</div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => this.setState({ showReportModal: false })}
                        className="px-4 py-2.5 text-xs font-bold text-[#5D6D7E] hover:bg-gray-100 rounded-xl transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#D35400] text-white font-extrabold text-xs rounded-xl hover:bg-[#E67E22] transition shadow-xs cursor-pointer"
                      >
                        Submit Report
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
