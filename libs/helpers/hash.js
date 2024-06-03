// Helper function to parse hash parameters
const getHashParams = () => {
  const hash = window.location.hash.substring(1); // Remove the leading '#'
  return new URLSearchParams(hash);
};

// Helper function to set hash parameters
const setHashParams = (params) => {
  const newHash = params.toString();
  window.location.hash = newHash;
};

const hashUrl = {
  getItem: (key) => {
    const params = getHashParams();
    return params.get(key);
  },

  setItem: (key, value) => {
    const params = getHashParams();
    params.set(key, value);
    setHashParams(params);
    return { key };
  },

  removeItem: (key) => {
    const params = getHashParams();
    params.delete(key);
    setHashParams(params);
    return { key };
  },
};

export default hashUrl;
