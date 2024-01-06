const getStats = async () => {
  const response = await fetch("http://localhost:3000/api/getstat");
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
