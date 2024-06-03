const parseUrl = () => {
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);

  const pathParams = {};
  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i];
    const value = segments[i + 1];
    if (key && value) {
      pathParams[key] = value;
    }
  }

  return pathParams;
};

const updateUrl = (pathParams) => {
  const queryParams = new URLSearchParams(window.location.search).toString();

  const pathSegments = [];
  Object.entries(pathParams).forEach(([key, value]) => {
    pathSegments.push(key, value);
  });
  const newPath = `/${pathSegments.join("/")}`;
  const newUrl = `${newPath}${queryParams ? `?${queryParams}` : ""}`;
  window.history.pushState({}, "", newUrl);
};

export default {
  getItem: (key) => decodeURIComponent(parseUrl()[key] || ""),
  setItem: (key, value) => {
    const pathParams = parseUrl();
    pathParams[key] = value;
    updateUrl(pathParams);
    return { key };
  },
  removeItem: (key) => {
    const pathParams = parseUrl();
    if (pathParams.hasOwnProperty(key)) {
      delete pathParams[key];
      updateUrl(pathParams);
    }
    return { key };
  },
};
