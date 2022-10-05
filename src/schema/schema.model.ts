import * as mongoose from 'mongoose';
import Schemas from './schema.interface';

const schmSchema = new mongoose.Schema({
  contract: String,
  schema_name: {
    type: String,
  },
  collection_name: String,
  created_at_time: String,
  created_at_lock: String,
}, { toJSON: { virtuals: true, getters: true }, timestamps: true });

schmSchema.virtual('collectionData', {
  ref: 'Collections',
  localField: 'collection_name',
  foreignField: 'collection_name',
});

schmSchema.virtual('data', {
  ref: 'SchemaDats',
  localField: 'schema_name',
  foreignField: 'schema_name',
});

const schemaModel = mongoose.model<Schemas & mongoose.Document>('Schemas', schmSchema);

export default schemaModel;
