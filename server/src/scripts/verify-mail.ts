
import "dotenv/config";
import { verifyMailConnection } from "../services/mail.service.js";

try {
  await verifyMailConnection();
  console.log("Gmail SMTP connection verified successfully.");
  process.exitCode = 0;
} catch (error) {
  console.error("Gmail SMTP connection failed:", error);
  process.exitCode = 1;
}
