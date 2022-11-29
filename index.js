const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

// mongodb

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6uwcgb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoriesCollection = client.db("bookSell").collection("categories");
    const booksCollection = client.db("bookSell").collection("allBooks");
    const bookingsCollection = client.db("bookSell").collection("bookings");

    // get all the categories from db.
    app.get("/categories", async (req, res) => {
      const query = {};
      const cursor = categoriesCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });

    // get single category item from db.
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const cursor = await booksCollection.find(query).toArray();
      return res.send(cursor);
    });

    // post add product item to db
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await booksCollection.insertOne(product);
      res.send(result);
    });

    //  post bookings data to db.
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error("Database connection error", error));

app.get("/", (req, res) => {
  res.send("Book sell server is running");
});

app.listen(port, () => {
  console.log(`Book sell server is running on port: ${port}`);
});
