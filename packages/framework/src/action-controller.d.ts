export default class ActionController extends ReactiveController {
    static collection: any;
    constructor(host: any, appState: any);
    host: any;
    generateId(): string;
    add: (record: any) => any;
    edit: (id: any, updates: any) => void;
    remove: (id: any) => void;
}
import { ReactiveController } from "./reactive-controller";
