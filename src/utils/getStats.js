const getStats = async () => {
  const response = await fetch("/api/getstat");
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
