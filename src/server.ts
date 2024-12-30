import express from "express";
import cors from "cors";
const inventoryRoutes = require("./routes/inventory");
const dotenv = require("dotenv").config().parsed;

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.use("/api/", inventoryRoutes);

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
