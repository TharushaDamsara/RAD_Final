import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "./env";

export const generateAccessToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpire as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, config.jwtSecret as string, options);
};

export const generateRefreshToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: config.jwtRefreshExpire as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign(payload, config.jwtRefreshSecret as string, options);
};

// ✅ Add this — verify access token
export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, config.jwtSecret as string);
};

// ✅ Add this — verify refresh token
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, config.jwtRefreshSecret as string);
};
