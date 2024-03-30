/** @typedef {typeof __propDef.props}  AvatarProps */
/** @typedef {typeof __propDef.events}  AvatarEvents */
/** @typedef {typeof __propDef.slots}  AvatarSlots */
export default class Avatar extends SvelteComponent<{
    src: any;
    theme?: string;
    alt?: string;
    size?: number;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type AvatarProps = typeof __propDef.props;
export type AvatarEvents = typeof __propDef.events;
export type AvatarSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        src: any;
        theme?: string;
        alt?: string;
        size?: number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
