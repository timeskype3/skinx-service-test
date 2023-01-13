import mongoose, { Schema, Types } from "mongoose";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IPost {
  title: string,
  content?: string,
  postedAt: string,
  postedById: Types.ObjectId,
  tags?: string[],
}

export interface IPostJsonImport extends Omit<IPost, 'postedById'> {
  postedById?: Types.ObjectId,
  postedBy?: string,
}

const postSchema: Schema = new Schema({
  title: { type: String, text: true },
  content: { type: String, default: null },
  postedAt: { type: Date },
  postedById: { type: Types.ObjectId, required: true },
  tags: [{ type: String }],
})

export default mongoose.model<IPost>("post", postSchema);