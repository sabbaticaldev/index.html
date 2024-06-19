import { html, ReactiveView, remove, T } from "frontend";

class CommunityItem extends ReactiveView {
  static get properties() {
    return {
      community: T.object(),
    };
  }

  render() {
    const { community } = this;

    return html`
      <uix-card
        variant="secondary"
        shadow
        rounded="sm"
        spacing="md"
        class="mb-4 border"
      >
        <div class="flex justify-start space-x-4">
          <img
            class="rounded object-contain shadow-md shadow-slate-400"
            src=${community?.image}
            alt="${community?.name}"
            style="width: 25%;"
          />
          <div class="flex flex-col justify-between">
            <div class="space-y-1">
              <p class="text-black font-medium">${community?.name}</p>
              <p class="text-gray-500 text-xs">${community?.description}</p>
            </div>
            <div class="w-48">
              <uix-button
                color="error"
                @click=${() => remove(`communities/${community.id}`)}
                style="margin-left: 8px;"
              >
                Remove
              </uix-button>
              <uix-button variant="primary"> More Info </uix-button>
              <uix-button
                alt="Minimum 30 users to appear in the website, you can change anything like location, accessType, etc"
                variant="primary"
              >
                Fork
              </uix-button>
            </div>
          </div>
        </div>
      </uix-card>
    `;
  }
}

export default ReactiveView.define("community-item", CommunityItem);
