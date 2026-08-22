import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import env from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
const app = express();

const allowedOrigins = new Set(
  env.CLIENT_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

if (env.PORT === "5000") {
  allowedOrigins.add("http://localhost:3000");
  allowedOrigins.add("http://127.0.0.1:3000");
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1", routes);
app.use(errorHandler);
export default app;
