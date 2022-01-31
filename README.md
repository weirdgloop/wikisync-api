# wikisync-api

API for the WikiSync feature

## Get started
You can either run the server directly on your machine, or run the server in a Docker container. The direct method is closer to what is run in production while the Docker method may be easier for development.
### Running directly
1. Run `yarn` to install deps.
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

### Running via Docker for development
1. Install Docker and Docker Compose
2. Run `docker-compose up`

#### Rebuilding container image
In the future, if you modify any of `package.json`, `package-lock.json`, or `yarn.lock`, then you will need to rebuild the container image. You can run `docker-compose build` to rebuild the contiainer images.

#### MySQL data
The data in the MySQL database is automatically persisted in a Docker volume.

You can view data in the MySQL database in a web browser at http://localhost:8080/?server=db&username=root&db=wikisync&select=player_data using the password `root-password`.

 If you would like to delete the state of the entire project run `docker-compose down --volumes`.

## Tooling
We use [airbnb's style guide](https://github.com/airbnb/javascript) in this project. ESLint will automatically lint with this for you if you use a supported editor (e.g VS Code).
