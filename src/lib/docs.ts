import { URL, fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const basePackageJson = fileURLToPath(new URL('../../package.json', import.meta.url));
const VERSION = JSON.parse(readFileSync(basePackageJson, 'utf8')).version;

const readme = `
![](/meta.jpg)

# Welcome to the API docs

These are the official docs for the [Baibusu.social](https://api.baibusu.social) project.
On the sidebar you will find all available endpoints that the API has to offer.
This documentation is intended for reference as the majority of options require administrative authorization.

The default rate limit for the API is 100 requests per 1000ms.
`;

export default {
  openapi: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Baibusu API',
      description: readme,
      version: VERSION,
    },
    tags: [
      {
        name: 'Insults',
        description: 'Insult routes.',
      },
    ],
  },
};
