import HttpException from './HttpException';

class CollectionNotFoundException extends HttpException {
  constructor(name: string) {
    super(404, `Collection ${name} not found`);
  }
}

export default CollectionNotFoundException;
