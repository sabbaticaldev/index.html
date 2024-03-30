/** @typedef {typeof __propDef.props}  StatusIndicatorProps */
/** @typedef {typeof __propDef.events}  StatusIndicatorEvents */
/** @typedef {typeof __propDef.slots}  StatusIndicatorSlots */
export default class StatusIndicator extends SvelteComponent<{
    theme?: string;
    online?: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type StatusIndicatorProps = typeof __propDef.props;
export type StatusIndicatorEvents = typeof __propDef.events;
export type StatusIndicatorSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
        online?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
