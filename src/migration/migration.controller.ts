import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import axios from 'axios';
import userModel from '../user/user.model';
import collectionModel from '../collection/collection.model';
import schemaModel from '../schema/schema.model';
import templateModel from '../template/template.model';
import assetModel from '../asset/asset.model';
import collectionMetaModel from '../collectionmeta/collectionmeta.model';
import schemadatsModel from '../schemadats/schemadats.model';
import tmplcapsModel from '../tmplcaps/tmplcaps.model';
import tinfoModel from '../tinfo/tinfo.model';
import stakesModel from '../stakes/stakes.model';
import stateModel from '../state/state.model';

interface StringMap{ [key: string] : string; }
interface AnyMap{ [key: string] : any; }

class MigrationController implements Controller {
  public path = '/migration';
  public router = Router();
  private contractAPI = 'https://onessushyp.waxgalaxy.io/v1/chain/get_table_rows';
  private user = userModel;
  private collection = collectionModel;
  private schema = schemaModel;
  private template = templateModel;
  private asset = assetModel;
  private collectionMeta = collectionMetaModel;
  private schmadats = schemadatsModel;
  private tmplcaps = tmplcapsModel;
  private tinfo = tinfoModel;
  private stakes = stakesModel;
  private state = stateModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/accounts`, this.saveAccount);
    this.router.get(`${this.path}/collections`, this.saveCollections);
    this.router.get(`${this.path}/schemas`, this.saveSchemas);
    this.router.get(`${this.path}/templates`, this.saveTemplates);
    this.router.get(`${this.path}/assets`, this.saveAssets);

  }

  private saveAccount = async (request: Request, response: Response) => {
    request.setTimeout(500000);

    try {
      const collections = await this.collection.find();

      const collection_whitelist = collections.map((collection: { collection_name: string }) => collection.collection_name).join(',');

      const accounts = await this.getAtomicData('accounts', { collection_whitelist, limit: 1000 });

      for (const account of accounts) {
        const createAccount = new this.user({
          ...account,
        });
        await createAccount.save();
      }

      response.send(accounts);
    } catch (e) {
      response.send({ message: JSON.stringify(e) });
    }

  }
  private saveCollections = async (request: Request, response: Response) => {
    try {

      const rows = await this.getTableRows('whenstakingx', 'genesisepoch', 'collections');

      // for (const row of rows) {
      //   const data = await this.getAtomicData(`collections/${row.collection_name}`);
      //   const createCollection = new this.collection({
      //     ...data,
      //   });
      //   const savedCollection = await createCollection.save();
      //   const createCollectionMeta = new this.collectionMeta({
      //     collection_name: savedCollection.collection_name,
      //     schema: row.schema,
      //     multis: row.multis,
      //     base_capacity: row.base_capacity,
      //   });
      //   await createCollectionMeta.save();
      // }

      const data = await this.getAtomicData('collections/whenstakingx');
      const createCollection = new this.collection({
        ...data,
      });
      const savedCollection = await createCollection.save();

      response.send({ success: true, data: rows });
    } catch (e) {
      console.log('error', e);
      response.send({ success: false, message: JSON.stringify(e) });
    }
  }

  private saveSchemas = async(request: Request, response: Response) => {
    try {
      const collections = await this.collection.find();
      for (const collection of collections) {
        const schemas = await this.getAtomicData('schemas', { collection_name: collection.collection_name });
        const schemadats = await this.getTableRows('whenstakingx', collection.collection_name, 'schemadats');

        for (const schema of schemas) {
          const createSchema = new this.schema({
            ...schema,
            collection_name: collection.collection_name,
          });
          const savedSchema = await createSchema.save();

          // const schemaData = schemadats.find((it: {schema_name: string}) => it.schema_name === schema.schema_name);
          // console.log('schemas', schemaData, schema);
          // const createSchemaDats = new this.schmadats({
          //   schema_id: savedSchema._id,
          //   ...schemaData,
          // });
          // await createSchemaDats.save();
        }
      }

      response.send({ success: true, data: collections });
    }catch (e) {
      response.send({ success: false, message: JSON.stringify(e) });
    }
  }

  private saveTemplates = async(request: Request, response: Response) => {
    try {
      const collections = await this.collection.find();
      for (const collection of collections) {
        const templates = await this.getAtomicData('templates', { collection_name: collection.collection_name });
        const tmplcaps = await this.getTableRows('whenstakingx', collection.collection_name, 'tmplcaps');
        for (const template of templates) {
          const createTemplate = new this.template({
            ...template,
            collection_name: template.collection.collection_name,
            schema_name: template.schema.schema_name,
          });
          const savedTemplate = await createTemplate.save();

          const tmplData = tmplcaps.find((it: {tmpl_id: string}) => it.tmpl_id === template.template_id);
          const createTmpl = new this.tmplcaps({
            template_id: template.template_id,
            ...tmplData,
          });
          await createTmpl.save();
        }
      }

      response.send({ success: true, data: collections });
    }catch (e) {
      response.send({ success: false, message: JSON.stringify(e) });
    }
  }

  private saveAssets = async(request: Request, response: Response) => {
    try {
      request.setTimeout(24 * 60 * 60 * 1000);

      const collections = await this.collection.find();

      const collection_whitelist = collections.map((collection: { collection_name: string }) => collection.collection_name).join(',');

      const accounts = await this.user.find({
        // createdAt: {
        //   $gte: new Date('2022-02-18T08:04:46.444+00:00'),
        // },
      });

      for (const account of accounts) {

        const tinfos = await this.getTableRows(
          'whenstakingx',
          'whenstakingx',
          'tinfos',
          'secondary',
          'name',
          account.account,
          account.account,
        );
        // const stakes = await this.getTableRows('whenstakingx', account.account, 'stakes');

        console.log(`${account.account}-tinfos`, tinfos.length);
        // console.log(`${account.account}-stake count`, stakes.length);

        for (const tinfo of tinfos) {
          const createTinfo = new this.tinfo({
            ...tinfo,
          });
          await createTinfo.save();
        }

        // const assets = await this.getAtomicData(`assets`,{
        //   owner: account.account,
        //   collection_whitelist,
        //   limit: 1000,
        // });

        // console.log(`${account.account}-assets`, assets.length);
        // for (const asset of assets) {
        //
        //   const saved_asset = await this.asset.find({ asset_id: asset.asset_id });
        //
        //   if (!saved_asset.length) {
        //     let smart_asset_data : StringMap = {};
        //     Object.keys(asset.data).forEach((key: string) => {
        //       const new_key = key.split('.').join('-');
        //       smart_asset_data[new_key] = asset.data[key];
        //     });
        //
        //     const createAsset = new this.asset({
        //       ...asset,
        //       data: smart_asset_data,
        //       collection_name: asset.collection?.collection_name,
        //       schema_name: asset.schema?.schema_name,
        //       template_id: asset.template?.template_id,
        //     });
        //     await createAsset.save();
        //
        //     const tinfo = tinfos.find((it: {asset_id: string}) => it.asset_id === asset.asset_id);
        //     if (tinfo) {
        //       console.log('tinfo', tinfo);
        //       const createTinfo = new this.tinfo({
        //         ...tinfo,
        //       });
        //       await createTinfo.save();
        //     }
        //
        //     const stake = stakes.find((it: {asset_id: string}) => it.asset_id === asset.asset_id);
        //     if (stake) {
        //       console.log('stake', stake);
        //       const createStake = new this.stakes({
        //         ...stake,
        //       });
        //       await createStake.save();
        //     }
        //   }
        //
        //
        // }
      }

      response.send({ success: true, data: accounts });
    }catch (e) {
      console.log('error', e);
      response.send({ success: false, message: JSON.stringify(e) });
    }
  }

  private getAtomicData = async (path: string, params: any = {}) => {
    let query = '';
    Object.keys(params).map((key) => {
      query += `${key}=${params[key]}&`;
    });

    let result: AnyMap[] = [];
    let page: number = 1;

    do {
      const added_query = query + `page=${page}`;
      const res = await axios.get(`${process.env.ATOMIC_API_HOST}atomicassets/v1/${path}?${added_query}`, {
        headers: {
          'Content-Type': 'application/json',
          // 'apikey': process.env.API_KEY,
        },
      });
      // console.log('res', res.data);
      if (res.data.success) {
        if (res.data.data.length) {
          result = result.concat(res.data.data);
          page += 1;
        } else {
          page = -1;
        }
      } else {
        page = -1;
      }
    } while (page > 0);
    return result;
  }

  private getTableRows = async(
      code: string,
      scope: string,
      table: string,
      index_position: string = 'primary',
      key_type: string = 'name',
      upper_bound : string = null,
      lower_bound: string = null) => {

    const res = await axios.post(`${process.env.RPC_API_HOST}v1/chain/get_table_rows`, {
      code,
      scope,
      table,
      index_position,
      key_type,
      upper_bound,
      lower_bound,
      limit: 1000,
      json: true,
    }, {
      headers: {
        'Content-Type': 'application/json',
        // 'apikey': process.env.API_KEY,
      },
    });
    // console.log('contract.res', res.data.rows);
    return res.data.rows;
  }
}

export default MigrationController;
