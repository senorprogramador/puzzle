const setup = process.env.PUZZLE_MONGODB_SETUP === "1";
const admin = db.getSiblingDB("admin");
const databaseName = process.env.MONGODB_DATABASE;
const application = db.getSiblingDB(databaseName);

const fail = (message) => {
  console.error(message);
  quit(2);
};

const initiate = () => {
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "localhost:27017" }],
  });
  quit(1);
};

try {
  admin.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD,
  );
} catch (error) {
  if (error.code !== 18) {
    throw error;
  }

  if (!setup) {
    fail("MongoDB administrator authentication failed. Run the generated db:setup script.");
  }

  // The localhost exception permits the first administrator only when no
  // users exist. It cannot reset credentials or replace an existing user.
  const hello = admin.hello();

  if (hello.isreplicaset && !hello.setName) {
    initiate();
  }
  if (!hello.isWritablePrimary) {
    quit(1);
  }

  try {
    admin.createUser({
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
      roles: [{ role: "root", db: "admin" }],
    });
  } catch (error) {
    if (error.code !== 13) {
      throw error;
    }

    fail("MongoDB already has users, but the administrator credentials do not match. Restore the original .env credentials or ask your database administrator. No passwords or data were reset.");
  }

  admin.auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD,
  );
}

try {
  rs.status();
} catch (error) {
  if (error.code !== 94) {
    throw error;
  }
  initiate();
}

if (!admin.hello().isWritablePrimary) {
  quit(1);
}

if (setup && !application.getUser(process.env.MONGODB_APP_USERNAME)) {
  application.createUser({
    user: process.env.MONGODB_APP_USERNAME,
    pwd: process.env.MONGODB_APP_PASSWORD,
    roles: [{ role: "readWrite", db: databaseName }],
  });
}

try {
  application.auth(
    process.env.MONGODB_APP_USERNAME,
    process.env.MONGODB_APP_PASSWORD,
  );
} catch (error) {
  if (error.code !== 18) {
    throw error;
  }
  fail("MongoDB application authentication failed. Restore the original .env credentials or update the user password as an administrator. No passwords or data were reset.");
}

quit(0);
