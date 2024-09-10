# psf-slp-db

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Overview

This is a REST API that provides access to a series of LevelDB instances. These Level databases are used to index SLP tokens on a blockchain. Each DB instance has a CRUD REST API for access by other applications.

The purpose of this code repository is to allow optimizations for parallel processing. By creating a REST API to these databases, multiple processes can access the same DB.

## Requirements

- node **^20.16.0**
- npm **^10.8.1**
- Docker **^24.0.7**
- Docker Compose **^1.27.4**

## Installation

### Production Environment

The [docker](./production/docker) directory contains a Dockerfile for building a production deployment.

```
docker-compose pull
docker-compose up -d
```

- You can bring the containers down with `docker-compose down`
- You can bring the containers back up with `docker-compose up -d`.

### Development Environment

A development environment will allow you modify the code on-the-fly and contribute to the code base of this repository. Ubuntu v20 is the recommended OS for creating a dev environment. Other operating systems may cause issues.

```bash
git clone https://github.com/Permissionless-Software-Foundation/psf-slp-db
cd psf-slp-db
./install-mongo-sh
npm install
npm start
```

### Configuration

This app is intended to be started via a bash shell script. See the environment variables used to configure this app in the [config/env/common.js file](./config/env/common.js).

## File Structure

The file layout of this repository follows the file layout of [Clean Architecture](https://christroutner.github.io/trouts-blog/blog/clean-architecture). Understaning the principles laid out this article will help developers navigate the code base.

## Usage

- `npm start` Start server on live mode
- `npm run docs` Generate API documentation
- `npm test` Run mocha tests

## Documentation

API documentation is written inline and generated by [apidoc](http://apidocjs.com/). Docs can be generated with this command:
- `npm run docs`

Visit `http://localhost:5020/` to view docs

There is additional developer documentation in the [dev-docs directory](./dev-docs).

## Dependencies

- [koa2](https://github.com/koajs/koa/tree/v2.x)
- [koa-router](https://github.com/alexmingoia/koa-router)
- [koa-bodyparser](https://github.com/koajs/bodyparser)
- [koa-generic-session](https://github.com/koajs/generic-session)
- [koa-logger](https://github.com/koajs/logger)
- [MongoDB](http://mongodb.org/)
- [Mongoose](http://mongoosejs.com/)
- [Passport](http://passportjs.org/)
- [Nodemon](http://nodemon.io/)
- [Mocha](https://mochajs.org/)
- [apidoc](http://apidocjs.com/)
- [ESLint](http://eslint.org/)
- [ipfs-coord](https://www.npmjs.com/package/ipfs-coord)

## IPFS

Snapshots pinned to IPFS will be listed here.

## License

[MIT](./LICENSE.md)