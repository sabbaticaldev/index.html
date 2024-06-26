let models = {};

const events = {
  STATE_CHANGE: async (data, { source }) => {
    if (!self.clients) return;
    const clients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: "window",
    });
    clients.forEach((client) => {
      if (client !== source) {
        client.postMessage(data);
      }
    });
  },
  PAGE_BUILDER_UPDATE_PAGE: async (data, { P2P }) => {
    const { title, url } = data;
    const TabsModel = models.tabs;
    const tabs = await TabsModel.getMany();
    const updateTabs = tabs
      .filter((tab) => tab.title === title)
      .map((tab) => ({ ...tab, url }));
    TabsModel.editMany(updateTabs);
    P2P.execute((client) => {
      if (client.url.includes(url.split("#")[0])) {
        client.navigate(url);
      }
    });
  },
  SYNC_DATA: async (data, { requestUpdate }) => {
    const { data: syncData } = data;
    for (let [modelName, entries] of Object.entries(syncData)) {
      const model = models[modelName];
      if (model) model?.setMany(entries);
    }
    requestUpdate();
  },
  REQUEST_UPDATE: async (data, { instance }) => {
    const { store } = data || {};
    instance.requestUpdate();
  },
};

export default events;
