declare function _default(methodsObject: any): {
    new (): {
        appState: any;
        host: any;
        generateId(): string;
        add: (record: any) => any;
        edit: (id: any, updates: any) => void;
        remove: (id: any) => void;
        subscribers: Object;
        eventHandlers: Object;
        subscriptionCallbacks: {};
        subscribe(key: string, callback: Function): void;
        unsubscribe(key: string, callback: Function): void;
        notify(key: any, newValue: any): void;
        on(event: any, handler: any): void;
    };
    collection: any;
};
export default _default;
