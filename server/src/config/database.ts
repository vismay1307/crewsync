import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ MongoDB Connected Successfully");
} catch (error) {
  console.error("❌ MongoDB Connection Failed:");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
}
};

export default connectDB;