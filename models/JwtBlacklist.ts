import mongoose, { Document, Schema, Model } from 'mongoose';

export interface JwtBlacklistDoc extends Document {
  timestamp: Date;
  token: string;
}

const JwtBlacklistSchema: Schema<JwtBlacklistDoc> = new Schema<JwtBlacklistDoc>({
  timestamp: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const JwtBlacklist: Model<JwtBlacklistDoc> = mongoose.model<JwtBlacklistDoc>('jwt_blacklist', JwtBlacklistSchema);
export default JwtBlacklist;
