const nextDatabaseName = process.env.MONGODB_NEXT_DATABASE;
const tanstackDatabaseName = process.env.MONGODB_TANSTACK_DATABASE;

db.getSiblingDB(nextDatabaseName).createUser({
  user: process.env.MONGODB_NEXT_APP_USERNAME,
  pwd: process.env.MONGODB_NEXT_APP_PASSWORD,
  roles: [{ role: "readWrite", db: nextDatabaseName }],
});

db.getSiblingDB(tanstackDatabaseName).createUser({
  user: process.env.MONGODB_TANSTACK_APP_USERNAME,
  pwd: process.env.MONGODB_TANSTACK_APP_PASSWORD,
  roles: [{ role: "readWrite", db: tanstackDatabaseName }],
});
