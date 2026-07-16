import User, { IUser } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const signupService = async (
  data: SignupData
): Promise<IUser> => {
  const { firstName, lastName, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  return user;
};