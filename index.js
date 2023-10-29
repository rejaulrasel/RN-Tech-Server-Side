const express = require('express')
const cors = require('cors')//cors for own server connected with own
const { MongoClient } = require('mongodb');
require("dotenv").config();//dotenv config
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8000

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f2uob.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);



async function run() {
  try {
    await client.connect();
    console.log('yes database Hitted')


    const database = client.db("Car-Mania");
    const usersCollection = database.collection("user");
    const servicesCollection = database.collection("services");
    const eventsCollection = database.collection("events");
    const reviewsCollection = database.collection("reviews");


    //get all Services
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      console.log(services);
      res.send(services);
    })


    //Save user to data base
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);

    })

    //Google Sign In update
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    })


    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })


    // add all events
    app.post("/addEvent", async (req, res) => {
      console.log(req.body);
      const result = await eventsCollection.insertOne(req.body);
      console.log(result);
      res.json(result); 
    });

    
    //get all events
    app.get('/events', async (req, res) => {
      const cursor = eventsCollection.find({});
      const events = await cursor.toArray();
      // console.log(services);
      res.send(events);
    })


    //Find the single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })


    //Admin
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })



    //user order
    app.get("/myEvents/:email", async (req, res) => {
      const result = await eventsCollection.find({
        email: req.params.email,
      }).toArray();
      res.send(result);
    });

    //Delete the user order
    app.delete('/deleteEvents/:id', async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await eventsCollection.deleteOne(query);
      //   console.log(result);
      res.json(result);
    })


    //Add Services to the shop by admin
    app.post('/addServices', async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.json(result);
    })


    //Update User
    app.put("/updateState/:id", async (req, res) => {
      console.log(req.params.id, req.body.state);
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          state: req.body.state,
        },
      };
      const result = await eventsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.json(result);
    });



    //Add Review for home page
    app.post('/user/review', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    })


    //Get all reviews
    app.get('/user/review', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const services = await cursor.toArray();
      console.log(services);
      res.send(services);
    })

    //Make a registered user to admin
    app.put("/users/adminAdd", async (req, res) => {
      const email = req.body.email;
      const filter = { email: email };
      console.log(email);
      const isUser = await usersCollection.findOne({ email: email });
      console.log(isUser);
      if (isUser) {
        const updateDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        console.log(result);
        res.json(result);
      } else {
        res.json({ message: "the user does not exist here" });
      }
    });

    //All Events for admin
    app.get("/allEvents", async (req, res) => {
      const result = await eventsCollection.find({}).toArray();
      // console.log(result);
      res.send(result);
    });



    //delete service
    app.delete("/deleteService/:id", async (req, res) => {
      console.log(req.params.id);
      const _id = req.params.id;
      const filter = { _id: ObjectId(_id) };
      const result = await servicesCollection.deleteOne(filter);
      console.log(result);
      res.json(result);
    });

  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello friends! This is server side!!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})