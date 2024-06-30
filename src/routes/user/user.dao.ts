import User, { UserDoc, UserDocUnsafe } from 'models/User';
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

export const saveUser = async (props: IAddUserPayload): Promise<UserDocUnsafe> => {
  const user = new User(buildSaveUserJson(props));
  const result: UserDocUnsafe = await user.save();
  return result;
};

export const getUserByEmail = async (email: string): Promise<UserDocUnsafe | null> => {
  // Don't use this method unless you need to get the password or verification token
  const user = await User.findOne({ email }).select('+password +verificationToken');
  return user;
};

export const getUserById = async (id: string): Promise<UserDoc | null> => {
  const user = await User.findById(id);
  return user;
};
