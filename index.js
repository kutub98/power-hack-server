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


// run fnction 
async function run() {
    try {
      await client.connect();
      console.log("POWER HACK Database connect");
    } catch (error) {
      console.error(error);
    }
}

// verify jwt function
function verifyJwt(req, res, next) {
    console.log("verify inside", req.headers.authorization);
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send("Unauthorized Access");
    }
    const token = authHeader.split(" ")[1];
    console.log(authHeader, token);
    jwt.verify(token, process.env.AccessToken, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(403).send({ message: "forbidden access" });
      }
      req.decoded = decoded;
      next();
    });
}

app.post("/jwt", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const UserToken = await users.findOne(query);
    if (UserToken){
      const token = jwt.sign({email}, process.env.AccessToken, { expiresIn: "1h" });
      return res.send({AccessToken: token});
    } else {
      res.status(403).send({ AccessToken: "" });
    }
  });


  app.get("/jwt", async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    const UserToken = await AllUser.findOne(query);
    if (UserToken) {
      const token = jwt.sign({ email }, process.env.AccessToken, { expiresIn: "1h" });
      return res.send({ AccessToken: token });
    } else {
      res.status(403).send({ AccessToken: "" });
    }
  });

const AllUser = client.db("Power-Hack-Server").collection("users");


//  storing user list 
app.post('/registration', async(req, res)=>{
    const user = req.body;
    const existingUser = await AllUser.findOne({email: user.email});
    // check if the email is already in used 
    if (existingUser) {
    return res.status(400).send({ error: "Email already in used" });
    }
    const saveUser = await AllUser.insertOne(user);
    console.log(saveUser);
    res.send(saveUser);
});

// receive user list 
app.get('/users', verifyJwt, async(req, res)=>{
    const user = {};
    const receiveUser = await AllUser.find(user).toArray()
    console.log(receiveUser);
    res.send(receiveUser)
})

app.post('/login', async(req, res)=>{
    const { email, password } = req.body;
    const user = await AllUser.findOne({ email });
    if (!user) {
        return res.status(400).send({ emailMessage: "Email is not found!" });
    }
    if (user.password !== password) {
        return res.status(400).send({ passwordMessage: "Incorrect Password" });
    }
    const token = jwt.sign({ email }, process.env.AccessToken, { expiresIn: "1h" });
    res.send({ successMessage: "Login successful", token });
});













run().catch((error) => console.error(error));

app.listen(port, (req, res) => {
  console.log(` POWER HACK server is running ${port}`);
});

