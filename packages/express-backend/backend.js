// backend.js
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import userServices from "./user-services.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//GET Query
app.get("/users", (req, res) => {
  userServices
    .getUsers()
    .then((result) => res.send({ users_list: result }))
    .catch((err) => res.status(500).send("Error: " + err));
});

//Get ID
app.get("/users/:id", (req, res) => {
  userServices
    .findUserById(req.params.id)
    .then((result) => {
      if (result == null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((err) => res.status(500).send("Error: " + err));
});

app.post("/users", (req, res) => {
  userServices
    .addUser(req.body)
    .then((result) => res.send(result))
    .catch((err) => res.status(400).send("Error: " + err));
});

app.delete("/users/:id", (req, res) => {
  userServices
    .deleteUser(req.params.id)
    .then((result) => {
      if (result == null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((err) => res.status(500).send("Error: " + err));
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
