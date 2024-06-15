import {  html } from "helpers";


export default {
  tag: "uix-modal-body",
  _theme: {
    "": "mb-4",
  },
  render() {
    return html`<div class="uix-modal-body"><slot></slot></div>`;
  },
};
