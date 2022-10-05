import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateSchemaDto from './schema.dto';
import CreateSchemaDatsDto from '../schemadats/schemadats.dto';
import schemaModel from './schema.model';
import schemadatsModel from '../schemadats/schemadats.model';
import SchemaNotFoundException from '../exceptions/SchemaNotFoundException';

class SchemaController implements Controller {
  public path = '/schemas';
  public router = Router();
  private schema = schemaModel;
  private schemaDats = schemadatsModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllSchemas);
    this.router.get(`${this.path}/:name`, this.getSchemaByName);
    this.router
      .all(`${this.path}/*`)
      // .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      // .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreateSchemaDto), this.createSchema)
      .post(`${this.path}/data`, validationMiddleware(CreateSchemaDatsDto), this.createSchemaData);
  }

  private getAllSchemas = async (request: Request, response: Response) => {
    const schemas = await this.schema.find()
      .populate('data', '-password');
    response.send(schemas);
  }

  private getSchemaByName = async (request: Request, response: Response, next: NextFunction) => {
    const name = request.params.name;
    const schema = await this.schema.find({ name });
    if (schema) {
      response.send(schema);
    } else {
      next(new SchemaNotFoundException(name));
    }
  }

  private createSchema = async (request: RequestWithUser, response: Response) => {
    const schemaData: CreateSchemaDto = request.body;
    const createdSchema = new this.schema({
      ...schemaData,
    });
    const savedSchema = await createdSchema.save();
    await savedSchema.populate('data').execPopulate();
    response.send(savedSchema);
  }

  private createSchemaData = async (request: Request, response: Response) => {
    const metaData = request.body;

    const createdSchemaData = new this.schemaDats({
      ...metaData,
    });

    const savedMeta = await createdSchemaData.save();
    response.send(savedMeta);
  }
}

export default SchemaController;
