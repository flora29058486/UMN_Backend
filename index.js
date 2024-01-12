import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import fs from 'fs';

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
  console.log('Authorization Code:', authorizationCode);
  console.log('Redirect URI:', redirectUri);

  if (!authorizationCode) {
    return res.status(400).send('未收到authorizationCode');
  }

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
        // redirect_uri: redirectUri,
      }),
    });

    const accessToken = await response.json();
    console.log('Access Token:', accessToken);
    // res.send(`<a href="electron-umn://?token=${accessToken}">Open in Electron App</a>`);
    res.send(`
    <html>
      <head>
        <script type="text/javascript">
          // 页面加载后立即执行重定向
          window.onload = function() {
            window.location.href = 'electron-umn://?token=${accessToken}';
          };
        </script>
      </head>
      <body>
        <p>Redirecting...</p>
      </body>
    </html>
  `);
    res.status(200).json(accessToken);

  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).send(`錯誤發生: ${error.message || error}`);
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
  

//   Authorization Code: 03c37a66-77a8-47dd-949d-2aa05fbdc94f
// Redirect URI: https%3A%2F%2Fumn-backend.vercel.app%2Fapi%2Fnotion
// Access Token: {
//   access_token: 'secret_5tS03GMVZVG8cH1CZL9fERBBTH7EevxliRzNxY4ApEn',
//   token_type: 'bearer',
//   bot_id: '157776e0-5756-4af0-8b9c-47ce9e55fc7b',
//   workspace_name: '嘎啦嘎啦',
//   workspace_icon: null,
//   workspace_id: '5f8acf10-571a-443f-b11a-57fc9f7ec1c6',
//   owner: {
//     type: 'user',
//     user: { object: 'user', id: 'b9837134-ba51-42b0-ad97-0e3e06ff581b' }
//   },
//   duplicated_template_id: null,
//   request_id: '9de779e3-4d8e-467b-aed1-0a857730bede'
// }
