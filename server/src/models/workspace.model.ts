import mongoose,{Schema,Types} from "mongoose";

export interface IWorkSpace{
name:string,
description?:string,
owner:Types.ObjectId,
logo?:string,
slug:string,
visibility:"private"|"public",
isDeleted:boolean,
deletedAt:Date

}
const workspaceSchema = new Schema<IWorkSpace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

workspaceSchema.index({ owner: 1 });
workspaceSchema.index({ name: 1 });

export const Workspace = mongoose.model<IWorkSpace>(
  "Workspace",
  workspaceSchema
);