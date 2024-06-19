export const getWhatsAppInfo = async (url, isCommunity) => {
  try {
    const action = isCommunity ? "fetch-community" : "fetch-group";
    const response = await fetch(
      `http://localhost:3000/${action}?url=${encodeURIComponent(url)}`,
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error("Failed to fetch Open Graph data");
  } catch (error) {
    console.error("Error fetching Open Graph data:", error);
    return null;
  }
};
