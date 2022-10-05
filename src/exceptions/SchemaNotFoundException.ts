import HttpException from './HttpException';

class SchemaNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Schema with id ${id} not found`);
  }
}

export default SchemaNotFoundException;
