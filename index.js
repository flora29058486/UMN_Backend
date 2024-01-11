import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import axios from "axios";
import mongoose from "mongoose";

import { env } from "./src/utils/env.js";

// import { listDatabases, exchangeToken } from "./notion.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 示例路由
app.get('/', (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

// 示例路由
app.get('/test', (req, res) => {
  res.json({
    message: "Test",
  });
});

// Notion get auth token
app.get('/api/notion', async (req, res) => {

  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URI;
  const authorizationCode = req.query.code;
  console.log(authorizationCode);
  console.log("redirect_uri", redirectUri);

  if (authorizationCode) {
    try {
      // encode in base 64
      const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      });

      const accessToken = await response.json();

      console.log("accessToken", accessToken);
      res.status(200).json(accessToken);

    } catch (error) {
      res.status(400).send('未收到授權碼');
    }
  } else {
    res.status(400).send('未收到authorizationCode');
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
  