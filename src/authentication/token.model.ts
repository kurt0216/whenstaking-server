import * as mongoose from 'mongoose';
import Token from './token.interface';

const tokenSchema = new mongoose.Schema({
    token: String,
    account: {
        type: String,
        required: true,
    },
    expired_in: Number,
});

const tokenModel = mongoose.model<Token & mongoose.Document>('Tokens', tokenSchema);

export default tokenModel;
