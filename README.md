# Octopus

![Octopus](.images/octopus.png)

## Did you know?

An octopus has three hearts! One heart circulates blood around the body, while the other two pump it past the gills, to pick up oxygen.

## About

Scalable Microservices Template with NestJS, Kafka, PostgreSQL and Redis (Docker and K8S)

## Getting Started

```bash
git clone https://github.com/MahdadGhasemian/octopus.git

cd octopus

# Run native
# fill proper environemnt (your external database and kafka)
npm i && npm i --prefix apps/auth && npm i --prefix apps/storage && npm i --prefix apps/store
npm run start:dev

# Run with docker-compose (Recommended)
npm i && npm i --prefix apps/auth && npm i --prefix apps/storage && npm i --prefix apps/store
docker-compose up
```

## Web UI Tools

1. [PgAdmin](http://localhost:8087/)
1. [Kafka UI](http://localhost:9020/)

## Project Structure

```
octopus
|
|___apps
|   |___auth
|   |   |___src
|   |   |___test
|   |   |   .evn
|   |   |   .Dockerfile
|   |   |   package-lock.json
|   |   |   package.json
|   |   |   tsconfig.app.json
|   |
|   |___storage
|   |   |___src
|   |   |___test
|   |   |   .evn
|   |   |   .Dockerfile
|   |   |   package-lock.json
|   |   |   package.json
|   |   |   tsconfig.app.json
|   |
|   |___store
|   |   |___src
|   |   |___test
|   |   |   .evn
|   |   |   .Dockerfile
|   |   |   package-lock.json
|   |   |   package.json
|   |   |   tsconfig.app.json
|
|___libs
|   |___common
|       |___src
|           |___constants
|           |___decorators
|           |___interceptors
|           |___validations
|           |___modules
|           |___enum
|           |___events
|           |___database
|           |___entities
|           |___logger
|           |___auth
|           |___health
|
|___migrations
|   |___developoing
|   |___stage
|   |___production
|
|   .dockerignore
|   .env
|   docker-compose.yaml
|   nest-cli.json
|   packge-lock.json
|   package.json
|   tsconfig.build.json
|   tsconfig.json
|   README.md
```

## Services

### Auth

![User Access](.images/user-access.png)

- Support dynamic access (role)

### Storage

![Resize And Change Quality of Image](.images/routes-download-resize-quality.png)

- Support multiple file formats:
  - Images: jpg, jpeg, png, bmp, tiff, gif, webp
  - Documents: doc, docx, xlsx, pdf, txt, rtf
  - Media: mp3, wav, mp4, avi, avi, mkv
  - Compressed: zip, rar, tar, 7z, gz
- Support public and private files
- Support resizing and changing the quality of images on download routes
- Support caching on the download routes
- Unique route to upload all files
- Unique route to download all files (if the file is an image type, the system will automatically consider caching and editing utitlies for the file)

## Store

## Swaggers

- Auth Service: [http://localhost:3000/docs#/](http://localhost:3000/docs#/)
- Store Service: [http://localhost:3001/docs#/](http://localhost:3001/docs#/)
- Storage Service: [http://localhost:3002/docs#/](http://localhost:3002/docs#/)

## Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3450407-89d900a2-cca7-4169-907c-7659658167b2?action=collection%2Ffork&collection-url=entityId%3D3450407-89d900a2-cca7-4169-907c-7659658167b2%26entityType%3Dcollection%26workspaceId%3D035031a5-5824-405a-951d-be779a75439a)

## Migration

There is possible to generate and run migration files on different branches separetly (developing, stage, production)

1. Create environment files - .env.migration.developing - .env.migration.stage - .env.migration.production
   example:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5436
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=randompassword
# POSTGRES_SYNCHRONIZE=true
POSTGRES_SYNCHRONIZE=false
POSTGRES_AUTO_LOAD_ENTITIES=true
```

2. Edit the 'POSTGRES_ENTITIES' parameter inside the package.json file according to your entities
3. Generate and run the migratinos

```bash
# Developing
npm run migration:generate:developing
npm run migration:run:developing

# Stage
npm run migration:generate:stage
npm run migration:run:stage

# Production
npm run migration:generate:production
npm run migration:run:production
```

## Cache Manager **_new_**

1. Only GET endpoints are cached.
2. Use `@NoCache()` decorator to bypass the caching system for specific endpoints.
3. Use `@GeneralCache()` decorator to cache the endpoint without including the user's token in the cache key.
4. Services caching status:

| Service Name | Module     | Cache Status | Decorator       | Note                                 |
| ------------ | ---------- | ------------ | --------------- | ------------------------------------ |
| Auth         | auth       | not cached   | @NoCache()      |                                      |
| Auth         | users      | cached       |                 | are cached according to user's token |
| Auth         | accesses   | cached       |                 | are cached according to user's token |
| Store        | categories | cached       | @GeneralCache() |                                      |
| Store        | products   | cached       | @GeneralCache() |                                      |
| Store        | orders     | not cached   | @NoCache()      |                                      |
| Store        | payments   | not cached   | @NoCache()      |                                      |
| Storage      |            | not cached   |                 |                                      |

## Roadmap

- [x] App microservices
- [x] Common libraries
- [x] Logger
- [x] Communication between microservices
- [x] Authentication (JWT, Cookie, Passport)
- [x] Dynamic roles (Access)
- [x] TypeORM Postgresql
  - [x] Entities
  - [x] Migrations on every branch separately
- [x] Docker-compose
- [x] Env
- [x] Document
  - [ ] Gitlab Readme
  - [x] Postman
  - [x] Auto generated swagger
- [ ] Test
- [x] Cache Manager (Redis)
- [ ] K8S

## TODO

- [x] Fix Get OTP to expire its session
- [x] full_name nullable
- [ ] Category Tree
- [ ] Get Lists be able to support the pagination
- [ ] Refresh Token

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
