import { html, post, ReactiveView, T } from "frontend";

import { getWhatsAppInfo } from "../lib/api.js";

class AppGroupForm extends ReactiveView {
  static get properties() {
    return {
      group: T.string(),
    };
  }

  setGroup(group) {
    this.group = group;
    this.requestUpdate();
  }

  async change({ target, key }) {
    if (key === "Enter" && target.value) {
      this.addGroup();
    } else {
      this.setGroup(target.value);
    }
  }

  async addGroup() {
    if (this.group) {
      const waData = await getWhatsAppInfo(this.group);
      if (waData && waData?.status !== "BAD_REQUEST") {
        const newGroup = {
          id: waData.id,
          name: waData.subject || "Unnamed Group",
          url: waData.url,
          image: waData.image || "default_image_path.jpg",
          size: waData.size,
          description: waData.desc || "No description available.",
          status: waData.status,
          users: waData.size,
          createdAt: new Date(waData.creation * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await post("/groups", newGroup);
        this.setGroup("");
      }
    }
  }

  render() {
    const { group } = this;
    return html`
      <uix-container horizontal gap="">
        <uix-input
          placeholder="Add new group"
          autofocus
          .value=${group}
          .input=${this.change.bind(this)}
          size="sm"
        ></uix-input>
        <uix-button @click=${this.addGroup}> Add </uix-button>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-group-form", AppGroupForm);
