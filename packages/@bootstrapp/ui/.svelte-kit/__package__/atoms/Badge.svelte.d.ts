/** @typedef {typeof __propDef.props}  BadgeProps */
/** @typedef {typeof __propDef.events}  BadgeEvents */
/** @typedef {typeof __propDef.slots}  BadgeSlots */
export default class Badge extends SvelteComponent<{
    theme?: string;
    count?: number;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type BadgeProps = typeof __propDef.props;
export type BadgeEvents = typeof __propDef.events;
export type BadgeSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
        count?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
