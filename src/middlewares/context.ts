import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';
import config from "../config";
import jwt from "jsonwebtoken";
import { GraphQLError } from 'graphql';



export const __disolveContext = async ({ req }: any) => {
    const authorization =
        req.headers["authorization"] ?? req.headers["Authorization"];
    if (authorization) {
        const token = authorization;
        try {
            const decoded: any = jwt.verify(token, config?.auth?.secret || "");
            return { user: decoded.user, version: "1.0.0", req: req };
        } catch (error: any) {
            console.log("ERROR", error);
            console.log(error);
            const errorMessage = error.message || "Authorization error";
            throw new GraphQLError(errorMessage, {
                extensions: {
                    code: "FORBIDDEN",
                },
            });
        }
    } else {
        return { user: null, version: "1.0.0", req: req };
    }
};


