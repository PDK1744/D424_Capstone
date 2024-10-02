const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('./models/Item');

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const seedItems = async () => {
    const items = [
        {
            name: "Test Item 1",
            description: "A test item",
            quantity: 50,
            location: "Warehouse A"
        },
        {
            name: "Test Item 2",
            description: "A test item 2",
            quantity: 100,
            location: "Warehouse B" 
        }
    ];
    await Item.insertMany(items);
    console.log('Data seeded!');
    mongoose.connection.close();
};

seedItems().catch(err => console.error(err));