import Logger from 'src/configs/logger';
import { IAddUserPayload, ILoginUserPayload } from './user.types';
import * as userDao from './user.dao';
import APIError from 'src/utils/APIError';
import { generateTokens } from 'src/utils/generateToken';
import Format from 'src/utils/format';
import { sendEmail } from 'src/services/mailing';
import env from 'src/configs/envVars';
import { UserDoc } from '../../../models/User';

const logger = new Logger('user.service.ts');

const SERVICES_NAMES = {
  addUser: 'addUser()',
  loginUser: 'loginUser()',
  verifyEmail: 'verifyEmail()',
  refreshAccessToken: 'refreshAccessToken()',
};

/**
 * Add new user in the users collection
 *
 * @param {props} props - User Data
 */
export const addUser = async (props: IAddUserPayload): Promise<any> => {
  logger.log(`[${SERVICES_NAMES.addUser}] is called`);

  const propsClone = Object.assign({}, props);

  /* Check user is already register with email or not */
  const userWithEmail = await userDao.checkUserEmailExist(props.email);

  if (userWithEmail) {
    throw new APIError({
      message: 'Account already exists with this email.',
      status: 400,
    });
  }

  const result = await userDao.saveUser(propsClone);
  const createdUser = result.toObject();
  delete createdUser.password;
  delete createdUser.verificationToken;

  sendEmail({
    recipients: [{ email: result.email }],
    params: {
      verification_url: `${env.BACKEND_URL}/api/user/verify/${result.verificationToken}?email=${result.email}`,
    },
    templateId: 1,
  });

  if (result) {
    return Format.success(createdUser, 'User created successfully');
  }
};

/**
 * login an user
 *
 * @param {props} props - user credentials
 */
export const loginUser = async (props: ILoginUserPayload): Promise<any> => {
  logger.log(`[${SERVICES_NAMES.loginUser}] is called`);

  const propsClone = Object.assign({}, props);
  const user = await userDao.getUserByEmail(propsClone.email);

  if (!user) {
    return Format.notFound('User not found');
  }

  const isPasswordMatch = await user.comparePassword(propsClone.password);
  const isVerified = user.isVerified;

  if (!isVerified) {
    sendEmail({
      recipients: [{ email: user.email }],
      params: {
        verification_url: `${env.BACKEND_URL}/api/user/verify/${user.verificationToken}?email=${user.email}`,
      },
      templateId: 1,
    });
    return Format.error(403, 'Email not verified. Verification link sent to your email.');
  }

  if (!isPasswordMatch) {
    return Format.unAuthorized('Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateTokens({ id: user.id, email: user.email });

  user.lastLogin = new Date();

  await user.save();

  const data = {
    accessToken,
    refreshToken,
  };

  if (user) {
    return Format.success(data, 'User login successful');
  }
};

/**
 * Verify email
 *
 * @param {token} token - verification token
 * @param {email} email - email
 */
export const verifyEmail = async (token: string, email: string): Promise<any> => {
  logger.log(`[${SERVICES_NAMES.verifyEmail}] is called`);

  const user = await userDao.getUserByEmail(email);

  if (!user) {
    return Format.notFound('User not found');
  }

  if (user.verificationToken === token) {
    user.isVerified = true;
    user.verificationToken = '';
    await user.save();
    return Format.success({}, 'Email verified successfully');
  }

  return Format.badRequest('Invalid verification link');
};

/**
 * Refresh Access Token
 *
 * @param {user} user - user
 */
export const refreshAccessToken = async (user: UserDoc | undefined): Promise<any> => {
  logger.log(`[${SERVICES_NAMES.refreshAccessToken}] is called`);

  if (!user) {
    return Format.notFound('User not found');
  }

  const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email });

  const data = {
    accessToken,
    refreshToken,
  };

  if (user) {
    return Format.success(data, 'User refresh token updated successfully');
  }
};
