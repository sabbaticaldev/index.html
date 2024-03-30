/** @typedef {typeof __propDef.props}  ReactionProps */
/** @typedef {typeof __propDef.events}  ReactionEvents */
/** @typedef {typeof __propDef.slots}  ReactionSlots */
export default class Reaction extends SvelteComponent<{
    theme?: string;
    count?: number;
    onClick?: () => void;
    emoji?: string;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type ReactionProps = typeof __propDef.props;
export type ReactionEvents = typeof __propDef.events;
export type ReactionSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
        count?: number;
        onClick?: () => void;
        emoji?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
