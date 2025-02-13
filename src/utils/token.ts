import jwt from "jsonwebtoken";
import config from "../config";


export const _generateToken = (user: any, expiresIn?: string | number
) => {
  try {
    const token = jwt.sign({ user: user.id }, config.auth.secret, {
      expiresIn: expiresIn || config.auth.token_expiry,
    });
    return token;
  } catch (e) {
    throw e;
  }
};
