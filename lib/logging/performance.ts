/**
 * Performance Tracking
 * Track and log performance metrics for debugging
 */

import { logger } from '../logger';

interface PerformanceMark {
  name: string;
  startTime: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private marks: Map<string, PerformanceMark> = new Map();
  private measurements: Array<{
    name: string;
    duration: number;
    metadata?: Record<string, any>;
  }> = [];

  /**
   * Start tracking a performance operation
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
    
    this.marks.set(name, {
      name,
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End tracking and log the duration
   */
  end(name: string, log: boolean = true): number | null {
    const mark = this.marks.get(name);
    if (!mark) {
      logger.warn(`Performance mark "${name}" not found`, {
        context: 'PerformanceTracker',
      });
      return null;
    }

    const duration = performance.now() - mark.startTime;

    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.measurements.push({
      name,
      duration,
      metadata: mark.metadata,
    });

    if (log) {
      logger.debug(`Performance: ${name} took ${duration.toFixed(2)}ms`, {
        context: 'PerformanceTracker',
        metadata: {
          duration,
          ...mark.metadata,
        },
      });
    }

    this.marks.delete(name);
    return duration;
  }

  /**
   * Measure async function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Measure sync function execution time
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get all measurements
   */
  getMeasurements() {
    return [...this.measurements];
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.marks.clear();
    this.measurements = [];
  }

  /**
   * Get summary of performance metrics
   */
  getSummary() {
    const summary: Record<string, {
      count: number;
      total: number;
      average: number;
      min: number;
      max: number;
    }> = {};

    this.measurements.forEach((measurement) => {
      if (!summary[measurement.name]) {
        summary[measurement.name] = {
          count: 0,
          total: 0,
          average: 0,
          min: Infinity,
          max: -Infinity,
        };
      }

      const stats = summary[measurement.name];
      stats.count++;
      stats.total += measurement.duration;
      stats.min = Math.min(stats.min, measurement.duration);
      stats.max = Math.max(stats.max, measurement.duration);
    });

    // Calculate averages
    Object.keys(summary).forEach((name) => {
      const stats = summary[name];
      stats.average = stats.total / stats.count;
    });

    return summary;
  }
}

export const performanceTracker = new PerformanceTracker();

