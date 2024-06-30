import mongoose, { Document, Schema, Model, Date } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserDoc extends Document {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<UserDoc> = new Schema<UserDoc>(
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
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Hash the password before saving the user
UserSchema.pre<UserDoc>('save', async function (this: UserDoc, next) {
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
UserSchema.methods.comparePassword = async function (this: UserDoc, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDoc> = mongoose.model<UserDoc>('User', UserSchema);
export default User;
