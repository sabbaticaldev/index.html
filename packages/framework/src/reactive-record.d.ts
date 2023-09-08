export default ReactiveRecord;
/**
 * Class representing an active record.
 */
declare class ReactiveRecord {
    /**
     * @param {Object} [initialState={}]
     * @param {Object} [config={}]
     */
    constructor({ data }?: Object | undefined, config?: Object | undefined);
    name: any;
    state: any;
    /**
     * Dispatch an event. The event handlers are responsible for updating the state.
     * @param {string} event
     * @param {*} [data]
     */
    dispatch(event: string, data?: any): void;
    /**
     * Used to set a state value and notify subscribers.
     * @param {string} key
     * @param {*} value
     */
    add(key: string, value: any): void;
    /**
     * Used to set a state value and notify subscribers.
     * @param {string} key
     * @param {*} value
     */
    edit(key: string, value: any): void;
    remove(key: any): void;
    get(key: any): any;
    list(): any;
}
