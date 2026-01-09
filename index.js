const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.COFFEE_DB_BUCKET}:${process.env.SECRET_KEY}@cluster0.l72lyls.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const coffeeStoreDB = client.db("coffee-store").collection("addCoffee");

    app.post("/add/coffee", async (req, res) => {
      const result = await coffeeStoreDB.insertOne(req.body);
      res.send(result);
    });
    app.get("/get/coffee", async (req, res) => {
      const cursor = coffeeStoreDB.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
