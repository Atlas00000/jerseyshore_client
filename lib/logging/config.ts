/**
 * Logging Configuration
 * Centralized configuration for client-side logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFileTransport: boolean;
  enablePerformanceTracking: boolean;
  enableErrorReporting: boolean;
  maxLogHistory: number;
  logToLocalStorage: boolean;
}

/**
 * Get logging configuration from environment variables
 */
export function getLoggingConfig(): LoggingConfig {
  const env = process.env.NODE_ENV || 'development';
  const logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL || 
    (env === 'production' ? 'warn' : 'debug')) as LogLevel;

  return {
    level: logLevel,
    enableConsole: true,
    enableFileTransport: env === 'production',
    enablePerformanceTracking: env === 'development',
    enableErrorReporting: env === 'production',
    maxLogHistory: 100,
    logToLocalStorage: env === 'development',
  };
}

/**
 * Check if a log level should be logged based on configuration
 */
export function shouldLog(level: LogLevel, config: LoggingConfig): boolean {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const configLevelIndex = levels.indexOf(config.level);
  const messageLevelIndex = levels.indexOf(level);
  
  return messageLevelIndex >= configLevelIndex;
}

