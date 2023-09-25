export async function handleResponse(response) {
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    throw new Error(message);
  }
  
  const text = await response.text();
  if (!text) {
    return null; // or return whatever makes sense in your context for empty responses
  }
  return JSON.parse(text);
}


// Get many records
export async function getMany(endpoint) {
  if(!endpoint) return;
  const response = await fetch(endpoint);
  return handleResponse(response);
}

// Get a single record by ID
export async function get(endpoint) {
  if(!endpoint) return;
  const response = await fetch(endpoint);
  return handleResponse(response);
}

// Create a new record
export async function post(endpoint, record) {
  if(!endpoint) return;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(record),
  });
  return handleResponse(response);
}

// Update a record by ID
export async function patch(endpoint, updates) {
  if(!endpoint) return;
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
}

// Delete a record by ID
export async function remove(endpoint) {
  console.log({endpoint});
  console.trace();
  if(!endpoint) return;
  const response = await fetch(endpoint, {
    method: "DELETE",
  });
  return handleResponse(response);
}
export default { remove, patch, post, get, getMany };