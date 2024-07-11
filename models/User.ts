import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDocUnsafe extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  otp?: string;
  otpExpires?: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDoc = Omit<UserDocUnsafe, 'password' | 'verificationToken'>;

const UserSchema: Schema<UserDocUnsafe> = new Schema<UserDocUnsafe>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // exclude password from query results unless explicitly requested
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false, // exclude password from query results unless explicitly requested
    },
    otp: {
      type: String,
      required: false,
      select: false,
    },
    otpExpires: {
      type: Date,
      required: false,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash the password before saving the user
UserSchema.pre<UserDocUnsafe>('save', async function (this: UserDocUnsafe, next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (this: UserDocUnsafe, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDocUnsafe> = mongoose.model<UserDocUnsafe>('User', UserSchema);
export default User;
