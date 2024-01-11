import {
  postBet,
  putBet,
  getAuthToken,
} from "../controllers/notion.js";
import express from "express";

const router = express.Router();

// POST /bet/:userid
router.post("/:userid", postBet);
// PUT /bet/:betid
router.put("/:betid", putBet);
router.get("/auth", getAuthToken);