import "server-only";
import DbConnect from "./DbConnect";

export const getPostsFromDB = async () => {
  const db = await DbConnect();
  const postCollection = db?.collection("post");
  return postCollection.find({}).toArray();
};