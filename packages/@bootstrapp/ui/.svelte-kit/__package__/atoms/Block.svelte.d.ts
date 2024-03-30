/** @typedef {typeof __propDef.props}  BlockProps */
/** @typedef {typeof __propDef.events}  BlockEvents */
/** @typedef {typeof __propDef.slots}  BlockSlots */
export default class Block extends SvelteComponent<{
    theme?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {
    default: {};
}> {
}
export type BlockProps = typeof __propDef.props;
export type BlockEvents = typeof __propDef.events;
export type BlockSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export {};
