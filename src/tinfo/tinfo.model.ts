import * as mongoose from 'mongoose';
import Tinfo from './tinfo.interface';

const tinfoSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    unique: true,
  },
  owner: String,
  level: Number,
  staked: Number,
  epoch: String,
  quantity: [String],
  value: [String],
  tpts: [String],
}, {
  toJSON: {virtuals: true, getters: true},
  timestamps: true,
});

const tinfoModel = mongoose.model<Tinfo & mongoose.Document>('Tinfos', tinfoSchema);

export default tinfoModel;
