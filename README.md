# wikisync-api

API for the WikiSync feature

## Get started
1. Run `yarn -i` to install deps.

2. Run a MySQL server and create the `wikisync` database in it.
3. Create a .env file that looks like this (fill in details):
```
TYPEORM_CONNECTION=mysql
TYPEORM_HOST=localhost
TYPEORM_USERNAME=root
TYPEORM_PASSWORD=
TYPEORM_DATABASE=wikisync
TYPEORM_PORT=3306
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
TYPEORM_ENTITIES=src/orm/*.ts
TYPEORM_MIGRATIONS=src/migration/*.ts
```
4. Run `yarn dev` to run server.

## Tooling
We use [airbnb's style guide](https://github.com/airbnb/javascript) in this project. ESLint will automatically lint with this for you if you use a supported editor (e.g VS Code).
