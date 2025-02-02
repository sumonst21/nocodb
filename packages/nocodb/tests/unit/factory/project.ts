import request from 'supertest';
import Project from '../../../src/lib/models/Project';
import TestDbMngr from '../TestDbMngr';

const externalProjectConfig = {
  title: 'sakila',
  bases: [
    {
      type: 'mysql2',
      config: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          port: '3306',
          user: 'root',
          password: 'password',
          database: TestDbMngr.sakilaDbName,
        },
      },
      inflection_column: 'camelize',
      inflection_table: 'camelize',
    },
  ],
  external: true,
};

const defaultProjectValue = {
  title: 'Title',
};

const defaultSharedBaseValue = {
  roles: 'viewer',
  password: 'test',
};

const createSharedBase = async (app, token, project, sharedBaseArgs = {}) => {
  await request(app)
    .post(`/api/v1/db/meta/projects/${project.id}/shared`)
    .set('xc-auth', token)
    .send({
      ...defaultSharedBaseValue,
      ...sharedBaseArgs,
    });
};

const createSakilaProject = async (context) => {
  const response = await request(context.app)
    .post('/api/v1/db/meta/projects/')
    .set('xc-auth', context.token)
    .send(externalProjectConfig);

  return (await Project.getByTitleOrId(response.body.id)) as Project;
};

const createProject = async (context, projectArgs = defaultProjectValue) => {
  const response = await request(context.app)
    .post('/api/v1/db/meta/projects/')
    .set('xc-auth', context.token)
    .send(projectArgs);

  return (await Project.getByTitleOrId(response.body.id)) as Project;
};

export { createProject, createSharedBase, createSakilaProject };
