export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private readonly context: string;
  private readonly level: LogLevel;

  constructor(context: string, level: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.level = level;
  }

  private log(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];

    const metaStr = Object.keys(meta).length > 0
      ? ` ${JSON.stringify(meta)}`
      : '';

    // Use stderr for warnings and errors, stdout for the rest
    const logFn = level >= LogLevel.WARN ? console.error : console.log;
    logFn(`[${timestamp}] [${levelStr}] [${this.context}] ${message}${metaStr}`);
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}): void {
    this.log(LogLevel.ERROR, message, meta);
  }
}