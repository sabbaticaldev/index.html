/** @typedef {typeof __propDef.props}  IconProps */
/** @typedef {typeof __propDef.events}  IconEvents */
/** @typedef {typeof __propDef.slots}  IconSlots */
export default class Icon extends SvelteComponent<{
    icon: any;
    theme?: string;
    svg?: {
        clipRule: boolean;
        viewBox: string;
        stroke: string;
        fill: string;
        path: string;
        'stroke-linecap': string;
        'stroke-linejoin': string;
        'stroke-width': string;
    };
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type IconProps = typeof __propDef.props;
export type IconEvents = typeof __propDef.events;
export type IconSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        icon: any;
        theme?: string;
        svg?: {
            clipRule: boolean;
            viewBox: string;
            stroke: string;
            fill: string;
            path: string;
            'stroke-linecap': string;
            'stroke-linejoin': string;
            'stroke-width': string;
        };
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
