import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";
/**
 * @type {import("mongodb").Db}
 */
let db;
const dbConnect = async () => {
  if (db) return db;
  try {
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wvig2d6.mongodb.net/?retryWrites=true&w=majority`;
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@13.229.79.153:27017`;

    // const uri = "mongodb://localhost:27017"
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    db = client.db(`ruqyahbd-forum`);

    await client.db("admin").command({ ping: 1 });
    return db;
  } catch (error) {
    console.log(error.message);
  }
};

export default dbConnect;
