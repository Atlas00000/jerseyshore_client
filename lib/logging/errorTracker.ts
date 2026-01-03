/**
 * Error Tracking Utilities
 * Track and aggregate errors for better debugging
 */

import { logger } from '../logger';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

interface TrackedError {
  id: string;
  message: string;
  error: Error;
  context: ErrorContext;
  timestamp: string;
  count: number;
  firstOccurrence: string;
  lastOccurrence: string;
}

class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private maxErrors: number = 100;

  /**
   * Track an error with context
   */
  trackError(
    error: Error,
    context: ErrorContext = {}
  ): string {
    const errorId = this.generateErrorId(error, context);
    const now = new Date().toISOString();

    const existing = this.errors.get(errorId);
    
    if (existing) {
      // Update existing error
      existing.count++;
      existing.lastOccurrence = now;
    } else {
      // Create new tracked error
      const trackedError: TrackedError = {
        id: errorId,
        message: error.message,
        error,
        context: {
          ...context,
          sessionId: context.sessionId || logger.getSessionId(),
        },
        timestamp: now,
        count: 1,
        firstOccurrence: now,
        lastOccurrence: now,
      };

      this.errors.set(errorId, trackedError);

      // Limit number of tracked errors
      if (this.errors.size > this.maxErrors) {
        const firstKey = this.errors.keys().next().value;
        if (firstKey) {
          this.errors.delete(firstKey);
        }
      }
    }

    // Log the error
    logger.error(error.message, {
      context: context.component || 'ErrorTracker',
      error,
      metadata: {
        errorId,
        ...context,
      },
    });

    return errorId;
  }

  /**
   * Generate unique error ID based on error message and context
   */
  private generateErrorId(error: Error, context: ErrorContext): string {
    const key = `${error.message}:${context.component || ''}:${context.action || ''}`;
    return `error_${this.hashString(key)}`;
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errors.size,
      byComponent: {} as Record<string, number>,
      byLevel: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
      recent: [] as TrackedError[],
    };

    this.errors.forEach((error) => {
      const component = error.context.component || 'unknown';
      stats.byComponent[component] = (stats.byComponent[component] || 0) + error.count;

      // Categorize by count (simple heuristic)
      if (error.count > 10) {
        stats.byLevel.critical++;
      } else if (error.count > 5) {
        stats.byLevel.high++;
      } else if (error.count > 2) {
        stats.byLevel.medium++;
      } else {
        stats.byLevel.low++;
      }

      // Get recent errors (last 10)
      if (stats.recent.length < 10) {
        stats.recent.push(error);
      }
    });

    // Sort recent by last occurrence
    stats.recent.sort((a, b) => 
      new Date(b.lastOccurrence).getTime() - new Date(a.lastOccurrence).getTime()
    );

    return stats;
  }

  /**
   * Get all tracked errors
   */
  getErrors(): TrackedError[] {
    return Array.from(this.errors.values());
  }

  /**
   * Clear all tracked errors
   */
  clear(): void {
    this.errors.clear();
  }
}

export const errorTracker = new ErrorTracker();

