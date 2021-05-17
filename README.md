# WebViewer Realtime Collab Sample

A sample project using the [WebViewer collab modules](https://collaboration.pdftron.com/).

## Demo

A live fork of this repo can be viewed at [https://collab-demo.pdftron.com](https://collab-demo.pdftron.com).

## Requirements

- Docker (used for the local postgres server)
- Yarn
- An Amazon S3 bucket

## Setup

### Install depedencies

```
yarn
```

### Set up environment variables

To do this, create a file called `.env` in the root of the project.

The following environment variables are required:

**`BUCKET_NAME`** The name of your Amazon S3 bucket

**`BUCKET_REGION`** The region of your Amazon S3 bucket

**`IDENTITY_POOL_ID`** The ID of an identity pool with read/write permission to your AWS S3 bucket

**`COLLAB_KEY`** A password to use when encoding JWT tokens. This can be set to any string

**`POSTGRES_HOST`** The host of your postgres database. For a local database, set this to `127.0.0.1`

**`POSTGRES_DB_NAME`** The name of the database to connect to. For local usage, set this to `collab`

**`POSTGRES_USERNAME`** The username to use when connecting to your database. For local usage, set this to `postgres`

**`POSTGRES_PASSWORD`** The password to use when connecting to your database

**`POSTGRES_PORT`** The port to run Postgres on. Should normally be set to `5432`

**`POSTGRES_MOUNT`** A location to mount the Postgres DB to.

**`SERVER_URL`** The URL of where the server will be running. For local testing you can set this to `http://localhost:3000`

**`SUBSCRIBE_URL`** The websocket URL of the server. For local testing you can set this to `ws://localhost:3000/subscribe`

**`AUTH_URL`** The URL of the authentication server. For local testing you can set this to `http://localhost:8080`

### Start the database

If you are running the project locally, you can start a local database by running:

```
yarn start-db
```

This will pull and start the Postgres docker image.

### Initialize the database

To generate the required tables and relationships in your database, run:

```
yarn init-db
```

### Start the project

To start the application, run the following two commands

```
yarn start-server
yarn start-client
```

