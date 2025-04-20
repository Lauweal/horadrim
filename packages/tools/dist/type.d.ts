export declare function isArray(arr: any): arr is any[];
export declare function isPromise(obj?: any): obj is Promise<any>;
export declare function isObject(obj: any): boolean;
export declare function isFunction(func: any): func is Function;
export declare function isAsyncFunction(fn: any): fn is (...args: any[]) => Promise<any>;
