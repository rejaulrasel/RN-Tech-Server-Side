const express = require('express')
const { MongoClient } = require('mongodb');
require("dotenv").config();//dotenv config
const app = express()
const port = 8000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f2uob.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);



async function run(){
    try{
        await client.connect();
        console.log('yes database connecteds')
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