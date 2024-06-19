const MAX_RETRIES = 5;
const RETRY_DELAY = 500;

function formatEndpoint(endpoint) {
  if (!endpoint.startsWith("http")) {
    return `/api/${endpoint}`.replace(/\/+/g, "/");
  }
  return endpoint;
}

async function handleResponse(response) {
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    throw new Error(message);
  }

  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    if (retries > 0) {
      console.log("Error fetching, trying again");
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function get(endpoint, params) {
  if (!endpoint) return;
  let url = formatEndpoint(endpoint);
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  return fetchWithRetry(url);
}

export async function post(endpoint, params) {
  if (!endpoint) return;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };
  return fetchWithRetry(formatEndpoint(endpoint), options);
}

export async function patch(endpoint, updates) {
  if (!endpoint) return;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  };
  return fetchWithRetry(formatEndpoint(endpoint), options);
}

export async function remove(endpoint) {
  if (!endpoint) return;
  const options = {
    method: "DELETE",
  };
  return fetchWithRetry(formatEndpoint(endpoint), options);
}

export default { remove, patch, post, get };
