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