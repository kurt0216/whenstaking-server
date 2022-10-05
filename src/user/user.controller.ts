import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import postModel from '../post/post.model';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import assetModel from '../asset/asset.model';

class UserController implements Controller {
  public path = '/users';
  public router = Router();
  private post = postModel;
  private user = userModel;
  private asset = assetModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:account`, authMiddleware, this.getUserByAccount);
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getUserByAccount = async (request: Request, response: Response, next: NextFunction) => {
    const account = request.params.account;

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

  private getAllPostsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const userId = request.params.id;
    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
    next(new NotAuthorizedException());
  }
}

export default UserController;
