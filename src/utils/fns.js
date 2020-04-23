const MongoClient = require("mongodb").MongoClient;

exports.dbConnect = async () => {
  const options = {
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Use IPv4, skip trying IPv6
  };

  const client = await MongoClient.connect(process.env.DB_CONN_STR, options);
  return client;
};
