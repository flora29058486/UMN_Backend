import NotionSchema from "../models/notion.js";
import mongoose from "mongoose";

import { genericErrorHandler } from "../utils/errors.js";

// POST a bet
// POST /bet/:userid
export const postBet = async (req, res) => {
  const { userid } = req.params;

  if (!userid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const user = await UserSchema.findOne({userId: userid});

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    const newBet = new BetSchema({
      betId: new mongoose.Types.ObjectId(),
      userId: userid,
      stake: 0,
      betPartner: ""
    });

    await newBet.save();

    return res.status(201).json(newBet);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// PUT bet (stake, partner)
// PUT /bet/:betid
export const putBet = async (req, res) => {
  const { betid } = req.params;
  const { stake, betPartner } = req.body;

  if (!betid) {
    return res.status(400).json({ error: 'Bet ID is required' });
  }

  const bet = await BetSchema.findOne({betId: betid});
  if (!bet) {
    return res.status(404).json({ error: 'Bet not found' });
  }

  try {
    bet.stake = stake;
    bet.betPartner = betPartner;

    await bet.save();

    return res.status(200).json(bet);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};
