const express = require("express");
const app = express();
const port = process.env.Port || 5000
const cors = require("cors")


// middle ware 

require('dotenv').config()
app.use(cors())
app.use(express.json())
const jwt = require("jsonwebtoken")


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.POWER_HACK_SERVER}:${process.env.POWER_HACK_KEY}@cluster0.mlxcjcs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      await client.connect();
      console.log("POWER HACK Database connect");
    } catch (error) {
      console.error(error);
    }
}
run().catch((error) => console.error(error));

app.listen(port, (req, res) => {
  console.log(` POWER HACK server is running ${port}`);
});

