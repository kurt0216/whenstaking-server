import * as mongoose from 'mongoose';
import State from './state.interface';

const stateSchema = new mongoose.Schema({
    maintenance: Boolean,
    admin: {
        type: String,
        unique: true,
    },
    manager: String,
    epoch: String,
    funding: [String],
    collect: String,
    expLvls: [String],
}, {
    toJSON: {virtuals: true, getters: true},
    timestamps: true,
});

const stateModel = mongoose.model<State & mongoose.Document>('State', stateSchema);

export default stateModel;
