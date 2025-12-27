/**
 * Client-side logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  error?: Error;
  metadata?: Record<string, any>;
}

class ClientLogger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, error, metadata } = entry;
    
    let log = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      log += ` [${context}]`;
    }
    
    log += ` ${message}`;
    
    if (error) {
      log += `\n  Error: ${error.message}`;
      if (error.stack) {
        log += `\n  Stack: ${error.stack}`;
      }
    }
    
    if (metadata && Object.keys(metadata).length > 0) {
      log += `\n  Metadata: ${JSON.stringify(metadata, null, 2)}`;
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, options?: {
    context?: string;
    error?: Error;
    metadata?: Record<string, any>;
  }) {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      ...options,
    };

    const formattedLog = this.formatLog(entry);

    // Use appropriate console method with styling
    const styles = {
      debug: 'color: #00BCD4;',
      info: 'color: #4CAF50;',
      warn: 'color: #FF9800;',
      error: 'color: #F44336; font-weight: bold;',
    };

    const style = styles[level] || '';
    const consoleMethod = level === 'error' ? console.error : 
                         level === 'warn' ? console.warn :
                         level === 'debug' ? console.debug : console.log;

    if (level === 'error') {
      console.error(`%c${formattedLog}`, style);
    } else if (level === 'warn') {
      console.warn(`%c${formattedLog}`, style);
    } else {
      console.log(`%c${formattedLog}`, style);
    }

    // In production, you might want to send errors to a logging service
    if (level === 'error' && entry.error) {
      // Could send to Sentry, LogRocket, etc.
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(entry.error);
      }
    }
  }

  debug(message: string, options?: { context?: string; metadata?: Record<string, any> }) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, options);
    }
  }

  info(message: string, options?: { context?: string; metadata?: Record<string, any> }) {
    this.log('info', message, options);
  }

  warn(message: string, options?: { context?: string; error?: Error; metadata?: Record<string, any> }) {
    this.log('warn', message, options);
  }

  error(message: string, options?: { context?: string; error?: Error; metadata?: Record<string, any> }) {
    this.log('error', message, options);
  }
}

export const logger = new ClientLogger();



