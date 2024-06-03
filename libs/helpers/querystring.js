export default {
  getItem: (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  setItem: (key, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history?.pushState?.(
      {},
      "",
      `${window.location.pathname}?${params}`,
    );
    return { key };
  },
  removeItem: (key) => {
    const params = new URLSearchParams(window.location.search);
    params.delete(key);
    window.history.pushState?.({}, "", `${window.location.pathname}?${params}`);
    return { key };
  },
};
