import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { env } from "./utils/env.js";

import { listDatabases } from "./notion.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 使用 express 创建一个路由处理函数来调用 testList 函数
app.get('/notion-users', async (req, res) => {
  try {
    const Databases = await listDatabases();
    res.json(Databases);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    app.listen(env.PORT, () =>
      console.log(`Server running on port http://localhost:${env.PORT}`),
    );
    // If the connection is successful, we will see this message in the console.
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    // Catch any errors that occurred while starting the server
    console.log("Failed to connect to MongoDB");
    console.log(error.message);
  });
  