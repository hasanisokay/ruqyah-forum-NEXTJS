const getAdmins = async () => {
  const admin = await fetch("api/admin/chatdata", {cache:"force-cache"});
  const data = await admin.json();
  return data;
};

export default getAdmins;
