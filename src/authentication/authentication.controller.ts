import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import * as jwt from 'jsonwebtoken';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.interface';
import Token from './token.interface';
import userModel from './../user/user.model';
import tokenModel from './token.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authenticationService = new AuthenticationService();
  private user = userModel;
  private token = tokenModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: Request, response: Response, next: NextFunction) => {
    console.log('register...');
    const userData: CreateUserDto = request.body;
    try {
      const tokenData = await this.authenticationService.register(userData);
      // response.setHeader('Set-Cookie', [cookie]);
      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  }

  private loggingIn = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const tokenData = await this.token.findOne({ account: logInData.account });
    if (tokenData) {
      response.send(tokenData);
      return;
    }

    const user = await this.user.findOne({ account: logInData.account });
    if (user) {

      const { token } = await this.createToken(user);
      // response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send(token);

    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: Request, response: Response) => {
    // response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken = async (user: User) => {
    const expiresIn = 24 * 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    const tokenData = jwt.sign(dataStoredInToken, secret, { expiresIn });

    const createToken = new this.token({
      expires_in: expiresIn,
      token: tokenData,
      account: user.account,
    });

    await createToken.save();

    return {
      expiresIn,
      token: tokenData,
    };
  }

}

export default AuthenticationController;
