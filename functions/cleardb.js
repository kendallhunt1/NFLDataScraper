const MongoClient = require('mongodb').MongoClient;
var dotenv = require('dotenv').config();

async function emptyCollection() {
  const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const databaseName = 'test'; // Replace with your database name
    const collectionName = 'singlegames'; // Replace with your collection name

    const collection = client.db(databaseName).collection(collectionName);

    const result = await collection.deleteMany({});

    console.log(`${result.deletedCount} documents deleted from the collection.`);
  } finally {
    await client.close();
  }
}

// Call the function to empty the collection
emptyCollection();
