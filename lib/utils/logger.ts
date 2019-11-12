export enum LogLevel {
    ALL,
    DEBUG,
    INFO,
    LOG,
    WARN,
    ERROR,
    NONE,
}


export class Logger {

    private _logLevel: LogLevel;
    private _moduleName: string = 'SubsetTree'

    constructor(logLevel: LogLevel = LogLevel.WARN) {
        this._logLevel = logLevel;
    }

    public debug(...args: any[]): void {
        if (this._shouldLog(LogLevel.DEBUG)) {
            this._log(console.debug, ...args);
        }
    }

    public info(...args: any[]): void {
        if (this._shouldLog(LogLevel.INFO)) {
            this._log(console.info, ...args);
        }
    }

    public log(...args: any[]): void {
        if (this._shouldLog(LogLevel.LOG)) {
            this._log(console.log, ...args);
        }
    }

    public warn(...args: any[]): void {
        if (this._shouldLog(LogLevel.WARN)) {
            this._log(console.warn, ...args);
        }
    }

    public error(...args: any[]): void {
        if (this._shouldLog(LogLevel.ERROR)) {
            this._log(console.error, ...args);
        }
    }

    public setLogLevel(logLevel: LogLevel): void {
        this._logLevel = logLevel
    }

    private _log(logger: (...args: any[]) => void, ...args: any[]): void {
        logger(`[${this._moduleName}] - `, ...args);
    }

    private _shouldLog(logLevel: LogLevel): boolean {
        return this._logLevel >= logLevel;
    }

}

export const _globalLogger = new Logger();
