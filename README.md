# busynest-api

[![Build Status](https://travis-ci.org/pillaru/busynest-api.svg)](https://travis-ci.org/pillaru/busynest-api) [![dependencies Status](https://david-dm.org/pillaru/busynest-api/status.svg)](https://david-dm.org/pillaru/busynest-api) [![devDependencies Status](https://david-dm.org/pillaru/busynest-api/dev-status.svg)](https://david-dm.org/pillaru/busynest-api?type=dev)

Make sure mongo db and mysql is running on localhost.

```
docker-compose up -d
```

Set environment variable of mongodb connection string

```
export bizhub_api_mongodb_connectionstring_dev=mongodb://busynest_sa:secret@localhost:27017/busynest
```

Run locally

```
sls offline
```

Execute the below command to set the connection string to mysql database as secret.

```
dotnet user-secrets --project src/BusyNest.DbMigration set "ConnectionStrings:Default" "Server=localhost;Database=busynest;Uid=sa;Pwd=password"
```
