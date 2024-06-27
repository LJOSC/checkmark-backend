import jwt from 'jsonwebtoken';
import env from 'src/configs/envVars';

if (!env.JWT_ACCESS_TOKEN_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
} else if (!env.JWT_REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_REFRESH_TOKEN_SECRET is not defined in environment variables');
}

interface Payload {
  id: string;
  email: string;
}

export const generateTokens = (payload: Payload): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION,
    algorithm: 'HS256',
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION,
    algorithm: 'HS256',
  });

  return { accessToken, refreshToken };
};
