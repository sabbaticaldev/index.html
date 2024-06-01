import { html, T } from "helpers";

const MockupPhone = {
  tag: "uix-mockup-phone",
  props: {
    prefix: T.string(),
    code: T.string(),
    highlight: T.boolean(),
    variant: T.string(),
  },
  theme: {
    "uix-mockup-phone":
      "relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-xl h-[700px] w-[400px] shadow-xl",
    "uix-mockup-phone__top":
      "w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute",
    "uix-mockup-phone__side": ({ position = "left", index = 0 }) => ({
      _base: `h-[${
        index === 0 ? 32 : index === 1 ? 46 : 64
      }px] w-[3px] bg-gray-800 absolute -${position}-[17px] top-[${
        index === 0 ? 72 : index === 1 ? 124 : 142
      }px] rounded-${position === "left" ? "l" : "r"}-lg`,
    }),
    "uix-mockup-phone__content":
      "rounded-xl overflow-hidden w-[372px] h-[672px] bg-white",
  },
  render() {
    return html`
      <div data-theme="uix-mockup-phone__top"></div>
      <div data-theme="uix-mockup-phone__side"></div>
      <div data-theme="uix-mockup-phone__side"></div>
      <div data-theme="uix-mockup-phone__side"></div>
      <div data-theme="uix-mockup-phone__side"></div>
      <div data-theme="uix-mockup-phone__content">
        <slot></slot>
      </div>
    `;
  },
};

export default MockupPhone;
