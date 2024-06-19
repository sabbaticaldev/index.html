import { html, post, ReactiveView, T } from "frontend";

import { getWhatsAppInfo } from "../lib/api.js";

class AppCommunityForm extends ReactiveView {
  static get properties() {
    return {
      communityUrl: T.string(),
    };
  }

  setCommunityUrl(communityUrl) {
    this.communityUrl = communityUrl;
    this.requestUpdate();
  }

  async addCommunity() {
    const { communityUrl } = this;
    if (communityUrl) {
      const waData = await getWhatsAppInfo(communityUrl);
      if (waData && waData?.communityInfo?.status !== "BAD_REQUEST") {
        const newCommunity = {
          name: waData.title || "Unnamed Community",
          url: communityUrl,
          description: waData?.communityInfo?.desc,
          image: waData.image,
          announcementGroup: "",
          groups: [],
          owner: "",
          admins: [],
        };
        await post("/communities", newCommunity);
        this.setCommunityUrl("");
      }
    }
  }

  render() {
    const { communityUrl } = this;
    return html`
      <uix-container horizontal gap="">
        <uix-input
          placeholder="Enter community URL"
          .value=${communityUrl}
          size="sm"
          @input=${(e) => this.setCommunityUrl(e.target.value)}
        ></uix-input>
        <uix-button @click=${this.addCommunity}>Add</uix-button>
      </uix-container>
    `;
  }
}

export default ReactiveView.define("app-community-form", AppCommunityForm);
