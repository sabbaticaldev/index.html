export default Adapters;
declare namespace Adapters {
    export { InMemoryStrategy as memory };
    export { QueryStringStrategy as url };
    export { SessionStorageStrategy as sessionStorage };
    export { LocalStorageStrategy as localStorage };
}
declare class InMemoryStrategy extends StorageStrategy {
    constructor();
    /** @type {Record<string, any>} */
    storage: Record<string, any>;
    get(key: any): any;
    _set(key: any, value: any): void;
    remove(key: any): void;
}
declare class QueryStringStrategy extends StorageStrategy {
    get(key: any, { params, noSuffix }?: {
        params: any;
        noSuffix: any;
    }): any;
    _set(key: any, value: any, { noSuffix }?: {
        noSuffix: any;
    }): void;
    /**
     * @param {string} key
     */
    remove(key: string): void;
}
declare class SessionStorageStrategy extends StorageStrategy {
    get(key: any): any;
    _set(key: any, value: any): void;
    remove(key: any): void;
}
declare class LocalStorageStrategy extends StorageStrategy {
    get(key: any): any;
    _set(key: any, value: any): void;
    remove(key: any): void;
}
/**
 * @interface
 */
declare class StorageStrategy {
    constructor(name: any);
    name: any;
    isServer: boolean;
    /**
     * @param {string} key
     * @returns {any}
     */
    get(key: string): any;
    /**
     * @returns {any[]}
     */
    list(): any[];
    /**
     * @param {string} key
     * @param {any} value
     * @private
     */
    private _set;
    /**
     * @param {string} key
     * @param {any} value
     */
    add(key: string, value: any): void;
    /**
     * @param {string} key
     * @param {any} value
     */
    edit(key: string, value: any): void;
}
