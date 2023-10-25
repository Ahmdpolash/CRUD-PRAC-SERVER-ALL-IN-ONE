const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

//!middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://practice_crud:polash@cluster0.yrssrk8.mongodb.net/?retryWrites=true&w=majority";

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
    const managementCollection = client.db("managementDB").collection("users");

    await client.connect();

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await managementCollection.insertOne(users);
      res.send(result);
    });

    //!get all user
    app.get("/users", async (req, res) => {
      const result = await managementCollection.find().toArray();
      res.send(result);
    });

    //!single data
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await managementCollection.findOne(query);
      res.send(result);
    });

    //!delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await managementCollection.deleteOne(query);
      res.send(result);
    });

    //!update
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const users = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUsers = {
        $set: {
          image: users.image,
          name: users.name,
          email: users.email,
          gender: users.gender,
          status: users.status
        }
      };
      const result = await managementCollection.updateOne(
        filter,
        updateUsers,
        options
      );
      res.send(result);
    });

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
  res.send("practice website cooming soon");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
