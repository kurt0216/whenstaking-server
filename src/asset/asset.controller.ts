import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';

import CreateAssetDto from './asset.dto';
import CreateTinfoDto from '../tinfo/tinfo.dto';
import CreateStakesDto from '../stakes/stakes.dto';

import assetModel from './asset.model';
import tinfoModel from '../tinfo/tinfo.model';
import stakesModel from '../stakes/stakes.model';
import schemaModel from '../schema/schema.model';
import * as moment from 'moment';

interface StringMap{ [key: string] : string; }

class AssetController implements Controller {
  public path = '/assets';
  public router = Router();
  private asset = assetModel;
  private schema = schemaModel;
  private tinfo = tinfoModel;
  private stake = stakesModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(this.path, this.getAllAssets);
    this.router.get(`${this.path}`, this.filterAssets);
    this.router.get(`${this.path}/:account`, this.getAssetByAccount);
    this.router
        .all(`${this.path}/*`)
        .post(this.path, validationMiddleware(CreateAssetDto), this.createAsset)
        .post(`${this.path}/tinfo`,  validationMiddleware(CreateTinfoDto), this.createTinfo)
        .post(`${this.path}/stake`,  validationMiddleware(CreateStakesDto), this.createStakes);
  }

  private getAssetByAccount = async (request: Request, response: Response, next: NextFunction) => {

    // const account = request.params.account;
    // const assets = await this.asset.find({ owner: account })
    //     .populate('collectionData schemaData template tinfo stake');
    //
    // if (assets) {
    //   response.send(assets);
    // } else {
    //   next(new AssetNotFoundException(account));
    // }
    response.send(moment.utc(new Date()).local().format('YYYY-MM-DDTHH:mm:ss'));
  }

  private filterAssets = async (request: Request, response: Response, next: NextFunction) => {
    const query = request.query;
    console.log('assets.filter', query);

    let assets = [];

    const collectionLookup = {
      from: 'collections',
      localField: 'collection_name',
      foreignField: 'collection_name',
      as: 'collection_data',
    };

    const templateLookup = {
      from: 'templates',
      localField: 'template_id',
      foreignField: 'template_id',
      as: 'template_data',
    };

    if (query.display === 'expired' || query.display === 'lease') {

      const now = moment.utc(new Date()).local().format('YYYY-MM-DDTHH:mm:ss');
      const expiration = query.display === 'expired' ? { $lte: now } : { $gte: now };

      const schemaLookup = {
        from: 'schemas',
        localField: 'schema_name',
        foreignField: 'schema_name',
        as: 'schema_data',
      };

      const parentLookup = {
        from: 'assets',
        localField: 'immutable_data.parent',
        foreignField: 'asset_id',
        as: 'parent_data',
      };

      const projects = { collection_data: 1, schema_data: 1, template: 1 };
      const collectionUnwind = '$schema_data';
      const match = { $and: [
        { 'immutable_data.expiration': expiration },
        { owner: { $eq: query.account } },
      ]};

      assets = await this.asset.aggregate([
        { $lookup: collectionLookup },
        { $lookup: schemaLookup },
        { $lookup: templateLookup },
        { $lookup: parentLookup },
        // { $unwind: collectionUnwind },
        { $match: match },
        // { $unwind: data_unwind },
        // { $project: projects },
      ]);
    } else if (query.display === 'mixed') {

      assets = await this.asset.find({ owner: query.account }).populate('collection_data schema_data template_data');

    } else if (query.display === 'stakable') {

      const schemas = await this.schema.find().populate('data');

      let blacklist: string[] = [];
      schemas.forEach((schema: { data: any }) => {
        if (schema.data && schema.data?.length && schema.data[0]?.blacklist && schema.data[0]?.blacklist?.length) {
          blacklist = blacklist.concat(schema.data[0]?.blacklist);
        }
      });

      const schemaLookup = {
        from: 'schemas',
        localField: 'schema_name',
        foreignField: 'schema_name',
        pipeline: [{
          $lookup: {
            from: 'schemadats',
            localField: 'schema_name',
            foreignField: 'schema_name',
            as: 'schemadats',
          },
        }],
        as: 'schema_data',
      };
      const template1Lookup = {
        from: 'templates',
        localField: 'template_id',
        foreignField: 'template_id',
        as: 'template_data',
      };
      const matchAccount = {
        $and: [
          { owner: { $eq: query.account } },
          { collection_name: { $ne: 'whenstakingx' } },
          { template_id : { $nin: blacklist } },
        ],
      };

      const projects = {
        stakable: { $not: [{ $in: ['$template_id', blacklist] }] },
      };

      assets = await this.asset.aggregate([
        { $lookup: collectionLookup },
        { $lookup: template1Lookup },
        // { $unwind: schema_unwind },
        { $lookup: schemaLookup },
        { $match: matchAccount },
        // { $match: matchBlacklist },
        // { $unwind: data_unwind },
        // { $project: projects },
      ]);
    }

    response.send(assets);
  }

  private createAsset = async (request: RequestWithUser, response: Response) => {

    try {
      const assetData: CreateAssetDto = request.body;
      console.log('create.asset', assetData);

      const data : StringMap = {};
      Object.keys(assetData.data).forEach((key: string) => {
        const new_key = key.split('.').join('-');
        data[new_key] = assetData.data[key];
      });

      const createdAsset = new this.asset({
        ...assetData,
        data,
      });
      const savedAsset = await createdAsset.save();
      response.send(savedAsset);
    } catch (e) {
      console.log('error', e);
      response.send({ message: JSON.stringify(e) });
    }

  }

  private createTinfo = async (request: RequestWithUser, response: Response) => {
    const tinfo = request.body;

    const createdTinfo = new this.tinfo({
      ...tinfo,
    });

    const savedMeta = await createdTinfo.save();
    response.send(savedMeta);
  }

  private createStakes = async (request: RequestWithUser, response: Response) => {
    const   stakes = request.body;

    const createdStakes = new this.stake({
      ...stakes,
    });

    const savedMeta = await createdStakes.save();
    response.send(savedMeta);
  }
}

export default AssetController;
