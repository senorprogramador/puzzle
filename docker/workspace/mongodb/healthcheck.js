const admin = db.getSiblingDB("admin");

try {
  admin.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD,
  );
} catch {
  quit(1);
}

try {
  const status = rs.status();

  if (status.myState !== 1) {
    quit(1);
  }
} catch (error) {
  if (error.code !== 94) {
    throw error;
  }

  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017" }],
  });
  quit(1);
}

quit(0);
