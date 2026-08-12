import mongoose,{Schema,Types} from "mongoose";

export interface IWorkSpace{
name:string,
description?:string,
owner:Types.ObjectId,
logo?:string,
timezone?:string,
defaultRole?:"admin"|"member",
colorTheme?:string,

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
    timezone: {
      type: String,
      default: "UTC",
    },
    defaultRole: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    colorTheme: {
      type: String,
      default: "default",
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
