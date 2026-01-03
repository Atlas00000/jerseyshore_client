/**
 * Logging Transports
 * Different output methods for logs (console, localStorage, remote)
 */

import type { LogLevel } from './config';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  error?: Error;
  metadata?: Record<string, any>;
  sessionId?: string;
  userId?: string;
}

/**
 * Console Transport
 * Enhanced console logging with styling and structured output
 */
export class ConsoleTransport {
  private logHistory: LogEntry[] = [];
  private maxHistory: number;

  constructor(maxHistory: number = 100) {
    this.maxHistory = maxHistory;
  }

  log(entry: LogEntry): void {
    // Add to history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistory) {
      this.logHistory.shift();
    }

    const formattedLog = this.formatLog(entry);
    const style = this.getStyle(entry.level);

    // Use appropriate console method
    switch (entry.level) {
      case 'error':
        console.error(`%c${formattedLog}`, style, entry.error || '');
        if (entry.metadata) {
          console.error('Metadata:', entry.metadata);
        }
        break;
      case 'warn':
        console.warn(`%c${formattedLog}`, style);
        if (entry.metadata) {
          console.warn('Metadata:', entry.metadata);
        }
        break;
      case 'debug':
        console.debug(`%c${formattedLog}`, style);
        if (entry.metadata) {
          console.debug('Metadata:', entry.metadata);
        }
        break;
      default:
        console.log(`%c${formattedLog}`, style);
        if (entry.metadata) {
          console.log('Metadata:', entry.metadata);
        }
    }
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    let log = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      log += ` [${context}]`;
    }
    
    log += ` ${message}`;
    
    if (entry.error) {
      log += `\n  Error: ${entry.error.message}`;
    }
    
    return log;
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #00F5FF; font-weight: normal;', // Cyan
      info: 'color: #00FF88; font-weight: normal;',  // Emerald
      warn: 'color: #F59E0B; font-weight: bold;',    // Amber
      error: 'color: #EF4444; font-weight: bold;',    // Rose
    };
    return styles[level] || '';
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

/**
 * LocalStorage Transport
 * Store logs in browser localStorage for debugging
 */
export class LocalStorageTransport {
  private key: string;
  private maxEntries: number;

  constructor(key: string = 'app_logs', maxEntries: number = 50) {
    this.key = key;
    this.maxEntries = maxEntries;
  }

  log(entry: LogEntry): void {
    try {
      const existing = this.getLogs();
      existing.push({
        ...entry,
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack,
          name: entry.error.name,
        } : undefined,
      });

      // Keep only recent entries
      if (existing.length > this.maxEntries) {
        existing.splice(0, existing.length - this.maxEntries);
      }

      localStorage.setItem(this.key, JSON.stringify(existing));
    } catch (error) {
      // localStorage might be full or unavailable
      console.warn('Failed to store log in localStorage:', error);
    }
  }

  getLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.warn('Failed to clear logs from localStorage:', error);
    }
  }
}

/**
 * Remote Transport
 * Send logs to remote logging service (e.g., Sentry, LogRocket)
 */
export class RemoteTransport {
  private endpoint?: string;
  private enabled: boolean;

  constructor(endpoint?: string, enabled: boolean = false) {
    this.endpoint = endpoint;
    this.enabled = enabled && !!endpoint;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.enabled || !this.endpoint) {
      return;
    }

    // Only send errors and warnings in production
    if (process.env.NODE_ENV === 'production' && 
        (entry.level === 'error' || entry.level === 'warn')) {
      try {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...entry,
            error: entry.error ? {
              message: entry.error.message,
              stack: entry.error.stack,
              name: entry.error.name,
            } : undefined,
            userAgent: navigator.userAgent,
            url: window.location.href,
          }),
        });
      } catch (error) {
        // Silently fail - don't break the app if logging fails
        console.warn('Failed to send log to remote service:', error);
      }
    }
  }
}

