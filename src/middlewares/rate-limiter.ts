import rateLimit from "express-rate-limit";
import { __disolveContext } from "./context";


export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 350, // Limit each IP to 350 requests per ⁠ window ⁠ (here, per 15 minutes).
    standardHeaders: 'draft-7',
    statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
    legacyHeaders: false,
    message: "Too many requests, please try again after a minute",
    keyGenerator: async (req) => {
        const authorizationHeader = req.headers.authorization;
        const authorizationToken = (
            authorizationHeader?.startsWith("Bearer")
                ? authorizationHeader?.replace("Bearer", "")
                : authorizationHeader
        )?.trim();
        const auth = await __disolveContext({ req });
        return auth?.user
    }
});