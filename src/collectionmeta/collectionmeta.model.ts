import * as mongoose from 'mongoose';
import collectionMeta from './collectionmeta.interface';

const collectionMetaSchema = new mongoose.Schema({
  collection_name: {
    type: String,
    unique: true,
  },
  schemas: [String],
  multis: [String],
  base_capacity: String,
},
{ toJSON: { virtuals: true, getters: true }, timestamps: true });

const collectionMetaModel = mongoose.model<collectionMeta & mongoose.Document>('CollectionMeta', collectionMetaSchema);

export default collectionMetaModel;
