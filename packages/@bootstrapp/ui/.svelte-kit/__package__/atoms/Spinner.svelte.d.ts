/** @typedef {typeof __propDef.props}  SpinnerProps */
/** @typedef {typeof __propDef.events}  SpinnerEvents */
/** @typedef {typeof __propDef.slots}  SpinnerSlots */
export default class Spinner extends SvelteComponent<{
    theme?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type SpinnerProps = typeof __propDef.props;
export type SpinnerEvents = typeof __propDef.events;
export type SpinnerSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
