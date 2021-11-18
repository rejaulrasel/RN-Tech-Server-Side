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



async function run(){
    try{
        await client.connect();
        console.log('yes database connected')

        const database = client.db("Car-Mania");
        const usersCollection = database.collection("user");
        const servicesCollection = database.collection("services");
        const eventsCollection = database.collection("events");
        const reviewsCollection = database.collection("reviews");


        //getServices
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    })


    // add events
    app.post("/addEvent", async (req, res) => {
      console.log(req.body);
      const result = await eventsCollection.insertOne(req.body);
      console.log(result);
      // res.json(result);
    });

        //getevents
        app.get('/events', async (req, res) => {
          const cursor = eventsCollection.find({});
          const events = await cursor.toArray();
          // console.log(services);
          res.send(events);
        })


    //Find single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    })


    //My events
    app.get("/myEvents/:email", async (req, res) => {
      const result = await eventsCollection.find({
        email: req.params.email,
      }).toArray();
      res.send(result);
    });

    //Delete Event
    app.delete('/deleteEvents/:id', async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await eventsCollection.deleteOne(query);
      //   console.log(result);
      res.json(result);
    })


    //Add Review
    app.post('/user/review', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    })


    //Get review
    app.get('/user/review', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const services = await cursor.toArray();
      // console.log(services);
      res.send(services);
    })


    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World friends!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})