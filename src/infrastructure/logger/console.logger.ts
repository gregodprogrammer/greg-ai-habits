import { ILogger } from './logger.interface';

export class ConsoleLogger implements ILogger {
  constructor(private readonly context?: string) {}

  private prefix(level: string): string {
    const ts = new Date().toISOString();
    return this.context ? `[${ts}] [${level}] [${this.context}]` : `[${ts}] [${level}]`;
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.prefix('INFO'), message, context ?? '');
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.prefix('WARN'), message, context ?? '');
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    console.error(this.prefix('ERROR'), message, error ?? '', context ?? '');
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.prefix('DEBUG'), message, context ?? '');
    }
  }
}
