import dotenv from "dotenv";
import development from "./development";
import production from "./production";
import test from "./test";
dotenv.config();

export interface Config {
  app: {
    name: string;
    env: "production" | "development" | "staging" | "test";
    port: string | number;
  };
  auth: {
    secret: string;
    token_expiry: string;
  };
  openai: {
    api_key: string;
  }
  redis: {
    host: string;
    database: number;
    port: number;
    username: string;
    password: string;
  };
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  },
}

console.log("ENVVVV", process.env["NODE_ENV"]);

const config =
  process.env["NODE_ENV"] === "development"
    ? development
    : process.env["NODE_ENV"] === "production"
      ? production
      : process.env["NODE_ENV"] === "test"
        ? test
        : undefined;


export default config;
