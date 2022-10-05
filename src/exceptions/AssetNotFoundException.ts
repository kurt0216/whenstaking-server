import HttpException from './HttpException';

class AssetNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Asset with id ${id} not found`);
  }
}

export default AssetNotFoundException;
