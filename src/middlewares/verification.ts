import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { IResolver } from "../type";
import _ from "lodash";
import { ForbiddenError } from "apollo-server-errors";
import { skip } from "graphql-resolvers";
import createError from "../utils/error";

declare module "express-serve-static-core" {
  interface Request {
    user: any;
  }
}

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  try {
    token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      throw new Error("No token");
    }

    jwt.verify(
      token,
      process.env["JWT-SECRET"]!,
      function (err: any, decoded: any) {
        if (err) {
          next(createError("Token expired", 401));
        }

        console.log(decoded);

        const { user } = decoded;
        req.user = user;
      }
    );

    next();
  } catch (err: any) {
    next(createError(err?.message, 401));
  }
};



export const isAuthenticated: IResolver = (root, args, { user }) =>
  user ? skip : new ForbiddenError("Not authenticated as user.");

