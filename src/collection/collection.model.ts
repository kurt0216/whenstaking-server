import * as mongoose from 'mongoose';
import Collections from './collection.interface';

const dataSchema = new mongoose.Schema({
  img: String,
  name: String,
  url: String,
  description: String,
});

const collectionSchema = new mongoose.Schema({
  contract: String,
  collection_name: {
    type: String,
    unique: true,
  },
  name: String,
  img: String,
  author: String,
  allow_notify: Boolean,
  authorized_accounts: [String],
  notify_accounts: [String],
  market_fee: Number,
  data: dataSchema,
  created_at_time: String,
  created_at_block: String,
}, {
  toJSON: { virtuals: true, getters: true },
  timestamps: true,
});

collectionSchema.virtual('meta', {
  ref: 'CollectionMeta',
  localField: 'collection_name',
  foreignField: 'collection_name',
});

const collectionModel = mongoose.model<Collections & mongoose.Document>('Collections', collectionSchema);

export default collectionModel;
