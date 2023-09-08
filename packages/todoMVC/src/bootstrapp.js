import { unsafeCSS } from "lit";
import { bootstrapp } from "bootstrapp";

const files = import.meta.glob("./app/**/*.{js,ts}", { eager: true });
import tailwind from "./assets/base.css";
const style = unsafeCSS(tailwind);

const Bootstrapp = bootstrapp({ files, style });
export default Bootstrapp;
