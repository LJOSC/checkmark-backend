import Logger from 'src/configs/logger';
import { IAddUserPayload, ILoginUserPayload } from './user.types';
import * as userDao from './user.dao';
import APIError from 'src/utils/APIError';
import { generateTokens } from 'src/utils/generateToken';
import Format from 'src/utils/format';

const logger = new Logger('user.service.ts');

const SERVICES_NAMES = {
  addUser: 'addUser()',
  loginUser: 'loginUser()',
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

  const result: any = await userDao.saveUser(propsClone);
  const { password: _, ...userWithoutPassword } = result.toObject();
  const { accessToken, refreshToken } = await generateTokens({ id: result.id, email: result.email });

  const data = {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };

  if (result) {
    return Format.success(data, 'User created successfully');
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
