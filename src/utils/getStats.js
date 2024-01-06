'use server'
const getStats = async () => {
  const response = await fetch("http://localhost:3000/api/getstat", {cache: "no-store" });
  const jsonData = await response.json();
  return jsonData;
};

export default getStats;
