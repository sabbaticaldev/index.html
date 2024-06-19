import { html, ReactiveView, remove, T } from "frontend";

class GroupItem extends ReactiveView {
  static get properties() {
    return {
      group: T.object(),
    };
  }

  render() {
    const { group } = this;
    const frequencyBadge = {
      low: "🟢",
      medium: "🟠",
      high: "🔴",
    }[group?.frequency];

    return html`
      <uix-card spacing="">
        <uix-container horizontal spacing="">
          <img src=${group?.image} alt="${group?.name}" style="width: 25%;" />
          <uix-container>
            <div class="flex-shrink">
              <p>
                <a href=${group?.url} class="text-black font-medium">
                  ${group?.name} ${group?.accessType}
                </a>
              </p>
              <div class="flex space-x-1 items-center">
                ${group?.ownerAvatar
                  ? html`<img
                      class="rounded-full shadow shadow-slate-400 h-5 w-5"
                      src=${group?.ownerAvatar}
                      alt=${group?.ownerName}
                    />`
                  : ""}
                <p class="text-xs font-bold">${group?.ownerName}</p>
              </div>
              <p class="text-gray-500 text-xs flex items-center space-x-1">
                <span>📍 ${group?.location}</span>
              </p>
              <div class="flex space-x-2 text-gray-500">
                <span class="flex items-center text-xs">
                  ${frequencyBadge} ${group?.users} members
                </span>
                <span class="flex items-center text-xs">
                  👤 ${group?.adminsCount} admins
                </span>
              </div>
              <p class="text-sm mt-2 text-gray-800">
                ${group?.description.split("\n")[0]}
              </p>
            </div>
            <div class="w-48 flex-shrink-0">
              <uix-button
                color="error"
                @click=${() => remove(`groups/${group.id}`)}
                style="margin-left: 8px;"
              >
                Remove
              </uix-button>
              <uix-button variant="primary"> More Info </uix-button>
              <uix-button
                variant="secondary"
                alt="Minimum 30 users to appear in the website, you can change anything like location, accessType, etc"
                variant="primary"
              >
                Fork
              </uix-button>
              <uix-button
                variant="secondary"
                alt="Minimum 30 users to appear in the website, you can change anything like location, accessType, etc"
                variant="primary"
              >
                Join
              </uix-button>
            </div>
          </uix-container>
        </uix-container>
      </uix-card>
    `;
  }
}

export default ReactiveView.define("group-item", GroupItem);
