import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const setupWinston(): void {
  const logDir = process.env.LOG_DIR || 'logs';
  const logLevel = process.env.LOG_LEVEL || 'info';
  const maxFiles = parseInt(process.env.LOG_MAX_FILES || '30', 10);

  // Custom log format
  const logFormat = winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  );

  // Console format for development
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'HH:mm:ss',
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} [${level}]: ${message} ${metaString}`;
    })
  );

  // Create transports
  const transports: winston.transport[] = [
    // Console transport
    new winston.transports.Console({
      level: logLevel,
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
    }),
  ];

  // File transports for production or when LOG_DIR is specified
  if (process.env.NODE_ENV === 'production' || logDir) {
    // Error log file
    transports.push(
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/error-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: logFormat,
        maxSize: '20m',
        maxFiles,
        zippedArchive: true,
      })
    );

    // Combined log file
    transports.push(
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/combined-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        format: logFormat,
        maxSize: '20m',
        maxFiles,
        zippedArchive: true,
      })
    );

    // API access log
    transports.push(
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/access-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        level: 'http',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxSize: '20m',
        maxFiles: 7,
        zippedArchive: true,
      })
    );
  }

  // Create logger instance
  const logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    transports,
    // Don't exit on handled exceptions
    exitOnError: false,
    // Handle uncaught exceptions and rejections
    exceptionHandlers: [
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/exceptions-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles,
      }),
    ],
    rejectionHandlers: [
      new (winston.transports as any).DailyRotateFile({
        filename: `${logDir}/rejections-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles,
      }),
    ],
  });

  // Add logger to global scope for easy access
  (global as any).logger = logger;

  // Handle process events
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
  });

  logger.info('Winston logger initialized', {
    level: logLevel,
    logDir,
    environment: process.env.NODE_ENV,
  });
}

export const getLogger = (context?: string): winston.Logger => {
  const logger = (global as any).logger || winston;
  
  if (context) {
    return logger.child({ context });
  }
  
  return logger;
};

// Export convenience methods
export const log = {
  error: (message: string, meta?: any) => getLogger().error(message, meta),
  warn: (message: string, meta?: any) => getLogger().warn(message, meta),
  info: (message: string, meta?: any) => getLogger().info(message, meta),
  debug: (message: string, meta?: any) => getLogger().debug(message, meta),
  verbose: (message: string, meta?: any) => getLogger().verbose(message, meta),
};