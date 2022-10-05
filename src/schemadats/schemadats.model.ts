import * as mongoose from 'mongoose';
import SchemaDats from './schemadats.interface';

const schemaDatsSchema = new mongoose.Schema({
  schema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schemas',
  },
  schema_name: {
    type: String,
  },
  epoch: [String],
  identifier: String,
  rarity_labels: [String],
  rarity_apr: [String],
  rarity_cap: [String],
  lvl_cap: [String],
  whitelist: [Number],
  blacklist: [Number],
}, { toJSON: { virtuals: true, getters: true }, timestamps: true });

const schemadatsModel = mongoose.model<SchemaDats & mongoose.Document>('SchemaDats', schemaDatsSchema);

export default schemadatsModel;
