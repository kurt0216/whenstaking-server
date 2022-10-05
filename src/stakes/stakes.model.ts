import * as mongoose from 'mongoose';
import Stakes from './stakes.interface';

const stakesSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        unique: true,
    },
    quantity: [String],
    tpts: [String],
}, {
    toJSON: {virtuals: true, getters: true},
    timestamps: true,
});

const stakesModel = mongoose.model<Stakes & mongoose.Document>('Stakes', stakesSchema);

export default stakesModel;
