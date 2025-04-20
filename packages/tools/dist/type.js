export function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
export function isPromise(obj) {
    return Object.prototype.toString.call(obj) === '[object Promise]';
}
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
export function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}
export function isAsyncFunction(fn) {
    return isFunction(fn) && fn.constructor.name === 'AsyncFunction';
}
