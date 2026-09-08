import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../src/types';

export interface IUserDocument extends Document {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  branch: string;
  year: string;
  role: UserRole;
  avatar?: string;
  clubName?: string;
  bio?: string;
  badges: string[];
  reputation: number;
}

const UserSchema = new Schema<IUserDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    branch: { type: String, default: 'Computer Science & Engg' },
    year: { type: String, default: '1st Year (Fresher)' },
    role: { type: String, enum: ['student', 'senior', 'club_admin', 'admin'], default: 'student' },
    avatar: { type: String },
    clubName: { type: String },
    bio: { type: String },
    badges: { type: [String], default: [] },
    reputation: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
