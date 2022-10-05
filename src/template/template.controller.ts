import { Request, Response, NextFunction, Router } from 'express';
import TemplateNotFoundException from '../exceptions/TemplateNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateTemplateDto from './template.dto';
import CreateTmplCapsDto from '../tmplcaps/tmplcaps.dto';
import templateModel from './template.model';
import tmplCapsModel from '../tmplcaps/tmplcaps.model';

class TemplateController implements Controller {
  public path = '/templates';
  public router = Router();
  private template = templateModel;
  private tmplCaps = tmplCapsModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllThemes);
    this.router.get(`${this.path}/:name`, this.getThemeById);
    this.router
      .all(`${this.path}/*`)
      // .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      // .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path,  validationMiddleware(CreateTemplateDto), this.createTemplate)
      .post(`${this.path}/caps`,  validationMiddleware(CreateTmplCapsDto), this.createTmplCaps);
  }

  private getAllThemes = async (request: Request, response: Response) => {
    const templates = await this.template.find()
      .populate('collectionData', 'schemaData', 'caps');
    response.send(templates);
  }

  private getThemeById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const template = await this.template.find({ template_id: id });
    if (template) {
      response.send(template);
    } else {
      next(new TemplateNotFoundException(name));
    }
  }

  private createTemplate = async (request: RequestWithUser, response: Response) => {
    const schemaData: CreateTemplateDto = request.body;
    const createdTheme = new this.template({
      ...schemaData,
    });
    const savedTemplate = await createdTheme.save();
    await savedTemplate.populate('author', '-password').execPopulate();
    response.send(savedTemplate);
  }

  private createTmplCaps = async (request: RequestWithUser, response: Response) => {
    const tmplCaps = request.body;

    const createdSchemaData = new this.tmplCaps({
      ...tmplCaps,
    });

    const savedMeta = await createdSchemaData.save();
    response.send(savedMeta);
  }
}

export default TemplateController;
