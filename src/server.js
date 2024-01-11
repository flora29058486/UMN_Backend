import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import axios from "axios";
import mongoose from "mongoose";

import { env } from "./utils/env.js";

// import { listDatabases, exchangeToken } from "./notion.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Notion get auth token
app.get('/api/notion', async (req, res) => {
  const authorizationCode = req.query.code;
  if (authorizationCode) {
    // 使用Axios向Notion請求存取令牌
    try {
      const response = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: process.env.NOTION_AUTH_URL,
      });
    
      const accessToken = response.data.access_token;
      // 存儲和使用這個令牌
      res.status(200).json(accessToken);
      // return accessToken;

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
  