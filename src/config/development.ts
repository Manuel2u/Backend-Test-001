import dotenv from "dotenv";
dotenv.config();
import { Config } from "./index";


const config: Config = {
  app: {
    name: "Backend-Test",
    port: 80,
    env: "development",
  },
  auth: {
    secret: process.env["JWT_SECRET"] || "",
    token_expiry: process.env["TOKEN_EXPIRY"] || "1d",
  },
  openai: {
    api_key: process.env["OPENAI_API_KEY"] || "",
  },
  redis: {
    host: process.env["REDIS_HOST"] || "127.0.0.1",
    port: parseInt(process.env["REDIS_PORT"] || "6379"),
    username: process.env["REDIS_USERNAME"] || "default",
    password: process.env["REDIS_PASSWORD"] || "Dodoo123#",
    database: parseInt(process.env["REDIS_DATABASE"] || "0"),
  },
  firebaseConfig: {
    apiKey: process.env["FIREBASE_API_KEY"] || "AIza",
    authDomain: process.env["FIREBASE_AUTH_DOMAIN"] || "",
    projectId: process.env["FIREBASE_PROJECT_ID"] || "",
    storageBucket: process.env["FIREBASE_STORAGE_BUCKET"] || "",
    messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"] || "",
    appId: process.env["FIREBASE_APP_ID"] || "",
    measurementId: process.env["FIREBASE_MEASUREMENT_ID"] || "",
  },
};

export default config;
