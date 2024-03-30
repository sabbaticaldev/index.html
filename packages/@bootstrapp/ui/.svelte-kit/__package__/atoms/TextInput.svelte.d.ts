/** @typedef {typeof __propDef.props}  TextInputProps */
/** @typedef {typeof __propDef.events}  TextInputEvents */
/** @typedef {typeof __propDef.slots}  TextInputSlots */
export default class TextInput extends SvelteComponent<{
    theme?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onChange?: () => void;
    bind?: any;
    autofocus?: boolean;
}, {
    [evt: string]: CustomEvent<any>;
}, {}> {
}
export type TextInputProps = typeof __propDef.props;
export type TextInputEvents = typeof __propDef.events;
export type TextInputSlots = typeof __propDef.slots;
import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme?: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
        value?: string;
        onChange?: () => void;
        bind?: any;
        autofocus?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export {};
