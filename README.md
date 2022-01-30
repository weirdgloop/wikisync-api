# wikisync-api

API for the WikiSync feature

## Get started
1. Run `yarn -i` to install deps.

### MySQL mode
1. Run a MySQL server.
2. Create a .env file that looks like this (fill in details):
```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_DATABASE=
```
3. Run `yarn dev` to run server.

### sqlite mode
1. Create a .env file that looks like this:
```
TYPEORM_CONNECTION = sqlite
TYPEORM_DATABASE = wikisync.db
```
2. Run `yarn dev` to run server.

## Tooling
We use [airbnb's style guide](https://github.com/airbnb/javascript) in this project. ESLint will automatically lint with this for you if you use a supported editor (e.g VS Code).