function formatEndpoint(endpoint) {
  if (!endpoint.startsWith("http")) {
    return `/api/${endpoint}`.replace("//", "/");
  }
  return endpoint;
}

export async function handleResponse(response) {
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

export async function getMany(endpoint) {
  if (!endpoint) return;
  const response = await fetch(formatEndpoint(endpoint));
  return handleResponse(response);
}

export async function get(endpoint) {
  if (!endpoint) return;
  const response = await fetch(formatEndpoint(endpoint));
  return handleResponse(response);
}

export async function post(endpoint, record) {
  if (!endpoint) return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(record)
  });
  return handleResponse(response);
}

export async function patch(endpoint, updates) {
  if (!endpoint) return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });
  return handleResponse(response);
}

export async function remove(endpoint) {
  if (!endpoint) return;
  const response = await fetch(formatEndpoint(endpoint), {
    method: "DELETE"
  });
  return handleResponse(response);
}

export default { remove, patch, post, get, getMany };
