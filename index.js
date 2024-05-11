const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// test
// wKet9xwmdmZp9B4e

const uri =
  "mongodb+srv://test:wKet9xwmdmZp9B4e@cluster0.dydwv3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dotJobCollection = client.db("dotJobDB").collection("data");
    const mybidsCollection = client.db("myBids").collection("data");

    app.post("/job", async (req, res) => {
      const data = req.body;
      const result = await dotJobCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });

    app.get("/job", async (req, res) => {
      const result = await dotJobCollection.find().toArray();
      res.send(result);
    });

    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await dotJobCollection.findOne(query);
      res.send(result);
    });

    app.get("/myjob/:email", async (req, res) => {
      const emailId = req.params.email;
      const query = {
        email: emailId,
      };
      const result = await dotJobCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/myjob/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await dotJobCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/myjob/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("id", id, data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedJob = {
        $set: {
          title: data.title,
          email: data.email,
          catagory: data.catagory,
          url: data.url,
          date: data.date,
          salary: data.salary,
          Location: data.Location,
          Level: data.Level,
          Education: data.Education,
          description: data.description,
        },
      };
      const result = await dotJobCollection.updateOne(
        filter,
        updatedJob,
        options
      );
      res.send(result);
      console.log(req.params.id);
    });

    app.get("/catagory/:id", async (req, res) => {
      const catagoryName = req.params.id;
      const query = {
        catagory: catagoryName,
      };
      const result = await dotJobCollection.find(query).toArray();
      res.send(result);
    });

    // My Bids
    app.post("/mybids", async (req, res) => {
      const data = req.body;
      const result = await mybidsCollection.insertOne(data);
      console.log(result);
      res.send(result);
    });
    
     app.get("/mybids/:email", async (req, res) => {
       const emailId = req.params.email;
       const query = {
         jobEmail: emailId,
       };
       const result = await mybidsCollection.find(query).toArray();
       res.send(result);
     });
     
     app.delete("/mybids/:id", async (req, res) => {
       const id = req.params.id;
       const query = {
         _id: new ObjectId(id),
       };
       const result = await mybidsCollection.deleteOne(query);
       res.send(result);
     });

    app.get("/", (req, res) => {
      res.send("Dot Job Server Is Running!");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
