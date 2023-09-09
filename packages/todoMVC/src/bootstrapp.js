import { unsafeCSS } from "lit";
import { bootstrapp } from "bootstrapp";
import "@vaadin/text-field";
import "@vaadin/button";
import "@vaadin/checkbox";
import "@vaadin/list-box";

const files = import.meta.glob("./app/**/*.{js,ts}", { eager: true });
import tailwind from "./assets/base.css";
const style = unsafeCSS(tailwind);

const Bootstrapp = bootstrapp({ files, style });
export default Bootstrapp;
