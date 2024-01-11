import dotenv from "dotenv";

dotenv.config();

// Make sure every environment variable is `string`.
export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "",
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || "",
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || "",
  REDIRECT_URI: process.env.NOTION_AUTH_URL || "",
};
