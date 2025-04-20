type BaseType = "string" |
    "function" |
    "object" |
    "array" |
    "bigint" |
    "boolean" |
    "symbol" |
    "number" |
    "undefined" |
    "null"

export function isArray(arr: any): arr is any[] {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

export function isPromise(obj?: any): obj is Promise<any> {
    return Object.prototype.toString.call(obj) === '[object Promise]'
}

export function isObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isFunction(func: any): func is Function {
    return Object.prototype.toString.call(func) === '[object Function]'
}

export function isAsyncFunction(fn: any): fn is (...args: any[]) => Promise<any> {
    return isFunction(fn) && fn.constructor.name === 'AsyncFunction';
}