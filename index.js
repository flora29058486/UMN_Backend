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
    message: "摸喜摸喜",
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
  
  if (!authorizationCode) {
    return res.status(400).send('未收到authorizationCode');
  }

  try {
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
      }),
    });

    const accessToken = await response.json();
    const tokenString = JSON.stringify(accessToken);
    console.log('Access Token:', accessToken);

    if (tokenString) {
      res.send(`
        <html>
          <head>
            <script type="text/javascript">
              // 页面加载后立即执行重定向
              window.onload = function() {
                window.location.href = 'electron-umn://?token=${tokenString}';
              };
            </script>
            <script type="text/javascript">
              function redirectToUMN() {
                window.location.href = 'electron-umn://?token=${tokenString}';
              }
            </script>
          </head>
          <body>
            <p>如果打開UMN應該就完成了!可以關掉了~</p>
            <p>如果沒有跳出彈窗詢問是否打開UMN就用以下按鈕看看</p>
            <button onclick="redirectToUMN()">打開UMN</button>
            <p>如果還是沒有跳出彈窗，請直接前往以下網址...</p>
            <p>electron-umn://?token=${tokenString}</p>
          </body>
        </html>
        
      `);
    } else {
      // 如果tokenString為空，可以發送錯誤響應或執行其他操作
      res.status(500).send('未獲得有效的tokenString');
    }
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
    // console.log("Connected to MongoDB");
  })
  .catch((error) => {
    // Catch any errors that occurred while starting the server
    console.log("Failed to connect to MongoDB");
    console.log(error.message);
  });
  