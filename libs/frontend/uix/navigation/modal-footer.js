import {  html } from "helpers";

export default {
  tag: "uix-modal-footer",
  _theme: {
    "": "flex justify-end",
  },
  render() {
    return html`<div class="uix-modal-footer"><slot></slot></div>`;
  },
};
