import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;
  isEmailVerified: boolean;
  refreshToken?: string;

  comparePassword(candidatePassword: string): Promise<boolean>;

  generateAccessToken(): string;

  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatar: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      userId: this._id,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User; 