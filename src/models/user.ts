import mongoose, { Schema } from "mongoose";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IUser {
  name: string,
  username: string,
  password: string,
}

export interface IUserResponse extends Omit<IUser, 'password'> {
  password?: string
}

const userSchema: Schema = new Schema({
  name: { type: String, trim: true, require: true },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  token: { type: String },
})

export default mongoose.model<IUser>("user", userSchema);