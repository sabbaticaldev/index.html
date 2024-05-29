export const fetchMapImage = async (mapUrl) => {
  const response = await fetch(mapUrl);
  return response.arrayBuffer();
};
