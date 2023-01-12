mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    let rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    let rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    let admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);
    let user = '$MONGO_INITDB_USERNAME';
    let passwd = '$MONGO_INITDB_PASSWORD';
    let dbName =  '$MONGO_INITDB_DATABASE'
    db.createUser({
      user: user,
      pwd: passwd,
      roles: [
        {
          role: "readWrite",
          db: dbName,
        }
      ]
    });
EOF