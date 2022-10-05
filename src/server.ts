import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostController from './post/post.controller';
import ReportController from './report/report.controller';
import MigrationController from './migration/migration.controller';
import UserController from './user/user.controller';
import CollectionController from './collection/collection.controller';
import SchemaController from './schema/schema.controller';
import TemplateController from './template/template.controller';
import AssetController from './asset/asset.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
  [
    new PostController(),
    new AuthenticationController(),
    new UserController(),
    new CollectionController(),
    new SchemaController(),
    new TemplateController(),
    new AssetController(),
    new MigrationController(),
  ],
);

app.listen();
