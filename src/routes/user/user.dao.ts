import User, { UserDoc } from 'models/User';
import { IAddUserPayload } from './user.types';
import crypto from 'crypto';

const buildSaveUserJson = (props: IAddUserPayload) => {
  const json = {
    firstName: props.firstName,
    lastName: props.lastName,
    username: props.username,
    email: props.email,
    password: props.password,
    verificationToken: crypto.randomBytes(32).toString('hex'),
  };
  return json;
};

export const checkUserEmailExist = async (email: string) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

export const saveUser = async (props: IAddUserPayload) => {
  const user = new User(buildSaveUserJson(props));

  const result: UserDoc = await user.save();
  return result;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};
