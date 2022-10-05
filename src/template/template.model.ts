import * as mongoose from 'mongoose';
import Template from './template.interface';

const templateSchema = new mongoose.Schema({
  contract: String,
  name: String,
  template_id: {
    type: String,
    unique: true,
  },
  is_transferable: Boolean,
  is_burnable: Boolean,
  issued_supply: String,
  max_supply: String,
  collection_name: String,
  schema_name: String,
  immutable_data: Map,
  created_at_time: String,
  created_at_block: String,
},
{ toJSON: { virtuals: true, getters: true }, timestamps: true });

templateSchema.virtual('collectionData', {
  ref: 'Collections',
  localField: 'collection_name',
  foreignField: 'collection_name',
});

templateSchema.virtual('schemaData', {
  ref: 'Schema',
  localField: 'schema_name',
  foreignField: 'schema_name',
});

templateSchema.virtual('caps', {
  ref: 'TmplCaps',
  localField: 'template_id',
  foreignField: 'template_id',
});

const templateModel = mongoose.model<Template & mongoose.Document>('Template', templateSchema);

export default templateModel;
