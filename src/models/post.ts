import mongoose, { ObjectId, Schema, Types } from "mongoose";

export interface IPost {
  title: string,
  content: string,
  postedAt: string,
  postedBy: ObjectId,
  tags: string[],
}

const postSchema: Schema = new Schema({
  title: { type: String, text: true },
  content: { type: String, default: null },
  postedAt: { type: Date },
  postedBy: { type: Types.ObjectId, required: true },
  tags: [{ type: String }],
})

export default mongoose.model<IPost>("post", postSchema);