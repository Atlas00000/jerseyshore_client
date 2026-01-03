/**
 * Enhanced Client-side Logger
 * Comprehensive logging with multiple transports, performance tracking, and structured output
 */

import { getLoggingConfig, shouldLog, type LogLevel } from './logging/config';
import { ConsoleTransport, LocalStorageTransport, RemoteTransport, type LogEntry } from './logging/transports';
import { performanceTracker } from './logging/performance';

class ClientLogger {
  private config = getLoggingConfig();
  private consoleTransport: ConsoleTransport;
  private localStorageTransport: LocalStorageTransport;
  private remoteTransport: RemoteTransport;
  private sessionId: string;

  constructor() {
    this.consoleTransport = new ConsoleTransport(this.config.maxLogHistory);
    this.localStorageTransport = new LocalStorageTransport(
      'app_logs',
      this.config.maxLogHistory
    );
    this.remoteTransport = new RemoteTransport(
      process.env.NEXT_PUBLIC_LOG_ENDPOINT,
      this.config.enableErrorReporting
    );
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    options?: {
      context?: string;
      error?: Error;
      metadata?: Record<string, any>;
    }
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context: options?.context,
      error: options?.error,
      metadata: options?.metadata,
      sessionId: this.sessionId,
    };
  }

  private async log(
    level: LogLevel,
    message: string,
    options?: {
      context?: string;
      error?: Error;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    // Check if we should log this level
    if (!shouldLog(level, this.config)) {
      return;
    }

    const entry = this.createLogEntry(level, message, options);

    // Console transport (always enabled if configured)
    if (this.config.enableConsole) {
      this.consoleTransport.log(entry);
    }

    // LocalStorage transport (development only)
    if (this.config.logToLocalStorage && this.localStorageTransport) {
      this.localStorageTransport.log(entry);
    }

    // Remote transport (production errors only)
    if (this.config.enableErrorReporting && this.remoteTransport) {
      await this.remoteTransport.log(entry);
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(
    message: string,
    options?: { context?: string; metadata?: Record<string, any> }
  ): void {
    if (this.config.level === 'debug') {
      this.log('debug', message, options);
    }
  }

  /**
   * Info level logging
   */
  info(
    message: string,
    options?: { context?: string; metadata?: Record<string, any> }
  ): void {
    this.log('info', message, options);
  }

  /**
   * Warning level logging
   */
  warn(
    message: string,
    options?: { context?: string; error?: Error; metadata?: Record<string, any> }
  ): void {
    this.log('warn', message, options);
  }

  /**
   * Error level logging
   */
  error(
    message: string,
    options?: { context?: string; error?: Error; metadata?: Record<string, any> }
  ): void {
    this.log('error', message, options);
  }

  /**
   * Performance tracking helper
   */
  performance = {
    start: (name: string, metadata?: Record<string, any>) => {
      if (this.config.enablePerformanceTracking) {
        performanceTracker.start(name, metadata);
      }
    },
    end: (name: string, log: boolean = true) => {
      if (this.config.enablePerformanceTracking) {
        return performanceTracker.end(name, log);
      }
      return null;
    },
    measureAsync: <T>(
      name: string,
      fn: () => Promise<T>,
      metadata?: Record<string, any>
    ) => {
      if (this.config.enablePerformanceTracking) {
        return performanceTracker.measureAsync(name, fn, metadata);
      }
      return fn();
    },
    measureSync: <T>(
      name: string,
      fn: () => T,
      metadata?: Record<string, any>
    ) => {
      if (this.config.enablePerformanceTracking) {
        return performanceTracker.measureSync(name, fn, metadata);
      }
      return fn();
    },
    getSummary: () => {
      if (this.config.enablePerformanceTracking) {
        return performanceTracker.getSummary();
      }
      return {};
    },
  };

  /**
   * Get log history from console transport
   */
  getHistory(): LogEntry[] {
    return this.consoleTransport.getHistory();
  }

  /**
   * Get logs from localStorage
   */
  getStoredLogs(): LogEntry[] {
    return this.localStorageTransport.getLogs();
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.consoleTransport.clearHistory();
    this.localStorageTransport.clearLogs();
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    const logs = this.getHistory();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

export const logger = new ClientLogger();
