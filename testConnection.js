//require('dotenv').config();
const {MongoClient} = require('mongodb');




async function run() {
    const url = "mongodb+srv://dbUser:dbUserPassword@d424capstone.vlmzc.mongodb.net/?retryWrites=true&w=majority&appName=D424capstone";
    const client = new MongoClient(url);
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