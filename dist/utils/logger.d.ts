export declare enum LogLevel {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    LOG = 3,
    WARN = 4,
    ERROR = 5,
    NONE = 6
}
export declare class Logger {
    private _logLevel;
    private _moduleName;
    constructor(logLevel?: LogLevel);
    debug(...args: any[]): void;
    info(...args: any[]): void;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    setLogLevel(logLevel: LogLevel): void;
    private _log;
    private _shouldLog;
}
export declare const _globalLogger: Logger;
