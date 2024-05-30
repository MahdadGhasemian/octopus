# Octopus

![Octopus](.images/octopus.png)

## Did you know?

An octopus has three hearts! One heart circulates blood around the body, while the other two pump it past the gills, to pick up oxygen.

## About

Scalable Microservices Template with NestJS, Kafka, PostgreSQL, (Docker and K8S)

## Getting Started

```bash
git clone https://github.com/MahdadGhasemian/octopus.git

cd octopus

# Run native
# fill proper environemnt (your external database and kafka)
npm run start:dev

# Run with docker-compose
docker-compose up
```

## Web UI Tools

1. [PgAdmin](http://localhost:8087/)
1. [Kafka UI](http://localhost:9020/)

## Services

### Auth

![User Access](.images/user-access.png)

- Support dynamic access (role)

### Storage

![Resize And Change Quality of Image](.images/routes-download-resize-quality.png)

- Support multiple file format
  images: jpg, jpeg, png, bmp, tiff, gif, webp
  documents: doc, docx, xlsx, pdf, txt, rtf
  media: mp3, wav, mp4, avi, avi, mkv
  compressed: zip, rar, tar, 7z, gz
- Support public and private files
- Support resizing and changing quality of images on download routes
- Support caching on the download routes
- Unique route to upload all files
- Unique route to download all files (if the file be an image type, system will consider caching and editing utitlies on the file)

## Migration

There is possible to generate and run migration files on different branches separetly (developing, stage, production)

1. Create environment files - .env.migration.developing - .env.migration.stage - .env.migration.production
   example:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=54132
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
- [ ] K8S

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
