require('dotenv').config();
const {MongoClient} = require('mongodb');

const url = process.env.MONGO__URL;
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Success! Connected!");
    } catch (err) {
        console.error(`Error: ${err.message}`);
        console.error(err.stack);
    } finally {
        await client.close();
    }
}

run().catch(console.err);