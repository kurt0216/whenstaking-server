import * as mongoose from 'mongoose';
import TmplCaps from './tmplcaps.interface';

const tmplCapsSchema = new mongoose.Schema({
  template_id: {
    type: String,
    unique: true,
  },
  value: [String],
}, { toJSON: { virtuals: true, getters: true } });

const tmplCapsModel = mongoose.model<TmplCaps & mongoose.Document>('TmplCaps', tmplCapsSchema);

export default tmplCapsModel;
