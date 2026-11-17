// Runs once, when the MongoDB data volume is first initialised.
// Creates the least-privileged user the application connects with.
const databaseName = process.env.MONGODB_DATABASE;

db.getSiblingDB(databaseName).createUser({
  user: process.env.MONGODB_APP_USERNAME,
  pwd: process.env.MONGODB_APP_PASSWORD,
  roles: [{ role: "readWrite", db: databaseName }],
});
