import { NextFunction, Request, Response } from "express";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { GraphQLError } from "graphql"
import dotenv from "dotenv";
dotenv.config();
import * as yup from 'yup';


export function formatError(err: GraphQLError) {
  if (err.message.includes("AuthorizationExpired")) {
    return new AuthenticationError("AuthorizationExpired");
  }
  if (err.message.includes("InvalidOrigin")) {
    return new ForbiddenError("InvalidOrigin");
  }
  if (err.message.includes("InvalidToken")) {
    return new AuthenticationError("InvalidToken");
  }
  return err;
}

const customError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode ? err.statusCode : 500;

  if (err instanceof yup.ValidationError) {
    return res.status(400).json({
      status: 'failed',
      message: 'Validation error',
      errors: err.errors,
    });
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env["NODE-ENV"] === "development" ? err.stack : null,
  });
};

export default customError