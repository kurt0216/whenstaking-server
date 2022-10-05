import * as mongoose from 'mongoose';
import Asset from './asset.interface';

const assetSchema = new mongoose.Schema({
    contract: String,
    asset_id: {
        type: String,
        unique: true,
    },
    owner: String,
    name: String,
    is_transferable: Boolean,
    is_burnable: Boolean,
    template_mint: String,
    collection_name: String,
    schema_name: String,
    template_id: String,
    backed_tokens: [Map],
    immutable_data: Map,
    mutable_data: Map,
    data: {
        type: mongoose.Schema.Types.Mixed,
    },
    burned_by_account: String,
    burned_at_block: String,
    burned_at_time: String,
    updated_at_block: String,
    updated_at_time: String,
    transferred_at_block: String,
    transferred_at_time: String,
    minted_at_block: String,
    minted_at_time: String,
},
    {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  });

assetSchema.virtual('collection_data', {
    ref: 'Collections',
    localField: 'collection_name',
    foreignField: 'collection_name',
});

assetSchema.virtual('schema_data', {
    ref: 'Schemas',
    localField: 'schema_name',
    foreignField: 'schema_name',
});

assetSchema.virtual('template_data', {
    ref: 'Template',
    localField: 'template_id',
    foreignField: 'template_id',
});

assetSchema.virtual('stake', {
    ref: 'Stakes',
    localField: 'asset_id',
    foreignField: 'asset_id',
});

assetSchema.virtual('tinfo', {
    ref: 'Tinfos',
    localField: 'asset_id',
    foreignField: 'asset_id',
});

const assetModel = mongoose.model<Asset & mongoose.Document>('Asset', assetSchema);

export default assetModel;
