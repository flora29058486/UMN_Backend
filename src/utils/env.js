import dotenv from "dotenv";

dotenv.config();

// Make sure every environment variable is `string`.
export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "",
  NOTION_ACCESS_TOKEN: process.env.OAUTH_CLIENT_SECRET || "",
};
