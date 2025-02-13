import { GraphQLError } from "graphql";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createError = (message: string, statusCode: number) => {
  return new CustomError(message, statusCode);
};

const createGraphQLError = (message: string, statusCode: number) => {
  throw new GraphQLError(message, {
    extensions: { statusCode },
  });
};

export default createError;
export { createGraphQLError };

