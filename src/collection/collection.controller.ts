import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import collectionModel from './collection.model';
import assetModel from '../asset/asset.model';
import collectionMetaModel from '../collectionmeta/collectionmeta.model';
import CreateCollectionDto from './collection.dto';
import CreateCollectionMetaDto from '../collectionmeta/collectionmeta.dto';
import CollectionNotFoundException from '../exceptions/CollectionNotFoundException';

class CollectionController implements Controller {
  public path = '/collections';
  public router = Router();
  private collection = collectionModel;
  private meta = collectionMetaModel;
  private asset = assetModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllCollections);
    this.router.get(`${this.path}/:name`, this.getCollectionByName);
    this.router
      .all(`${this.path}/*`)
      .post(this.path, validationMiddleware(CreateCollectionDto), this.createCollection)
      .post(`${this.path}/meta`, validationMiddleware(CreateCollectionMetaDto), this.createCollectionMeta)
  }

  private getAllCollections = async (request: RequestWithUser, response: Response) => {
    const account = request.query.account;
    console.log('collections.withUser', account);

    const matchAccount = {
      $and: [
        { 'owner': { $eq: account } },
      ],
    };

    const group = {
      _id: "$collection_name", assets: { $sum: 1 },
    };

    const lookup = {
      from: 'collections',
      localField: '_id',
      foreignField: 'collection_name',
      as: 'collection',
    };

    const assetByCollection = await this.asset.aggregate([
      { $match: matchAccount },
      { $group: group },
      { $lookup: lookup },
    ]);


    response.send({
      collections: assetByCollection,
    });
  }

  private getCollectionByName = async (request: Request, response: Response, next: NextFunction) => {
    const {name} = request.params;
    const post = await this.collection.find({ collection_name: name }).populate('meta');;
    if (post) {
      response.send(post);
    } else {
      next(new CollectionNotFoundException(name));
    }
  }

  private createCollection = async (request: RequestWithUser, response: Response) => {
    const collectionData: CreateCollectionDto = request.body;
    // console.log('create.collection', collectionData);
    const createdCollection = new this.collection({
      ...collectionData,
    });
    const savedCollection = await createdCollection.save();
    // await savedCollection.populate('author', '-password').execPopulate();
    response.send(savedCollection);
  }

  private createCollectionMeta = async (request: Request, response: Response) => {
    const metaData = request.body;
    
    const createdCollectionMeta = new this.meta({
      ...metaData,      
    });

    const savedMeta = await createdCollectionMeta.save();
    response.send(savedMeta);
  }
}

export default CollectionController;
