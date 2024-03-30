/** @typedef {typeof __propDef.props}  MenuItemProps */
/** @typedef {typeof __propDef.events}  MenuItemEvents */
/** @typedef {typeof __propDef.slots}  MenuItemSlots */
export default class MenuItem extends SvelteComponent<{
    item: any;
    theme?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type MenuItemProps = typeof __propDef.props;
export type MenuItemEvents = typeof __propDef.events;
export type MenuItemSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        item: any;
        theme?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
