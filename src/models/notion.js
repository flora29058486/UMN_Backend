import mongoose, { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

const NotionSchema = new mongoose.Schema(
  {
    betId: {
      type: ObjectId,
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
    },
    stake: {
      type: Number,
      required: true,
      min: 0,
    },
    betPartner: {
      type: String,
    },
  }
);

const Notion = mongoose.model('Notion', NotionSchema);
export default Notion;
