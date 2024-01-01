const getStats = async () => {
  const response = await fetch("/api/getstat", { cache: "force-cache" });
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
