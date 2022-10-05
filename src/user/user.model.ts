import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      unique: true,
    },
    assets: String,
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  },
);

userSchema.virtual('data',{
    ref: 'Asset',
    localField: 'account',
    foreignField: 'owner',
})

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
