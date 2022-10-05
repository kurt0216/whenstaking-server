import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.interface';
import userModel from './../user/user.model';
import tokenModel from './token.model';

class AuthenticationService {
  public user = userModel;
  public token = tokenModel;

  public async register(userData: CreateUserDto) {
    if (
      await this.user.findOne({ account: userData.account })
    ) {
      throw new UserWithThatEmailAlreadyExistsException(userData.account);
    }

    const user = await this.user.create({
      ...userData,
    });
    const token = await this.createToken(user);
    // const cookie = this.createCookie(tokenData);
    return {
      token,
      user,
    };
  }
  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
  public createToken = async (user: User) => {
    const expiresIn = 24 * 60 * 60; // a day
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };

    const tokenData = jwt.sign(dataStoredInToken, secret, { expiresIn });
    const createToken = new tokenModel({
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

export default AuthenticationService;
