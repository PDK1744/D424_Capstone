const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({    
    name: { 
        type: String,
        required: true,
    },
    description: {  
        type: String,
    },
    quantity: { 
        type: Number,
        required: true,
        default: 0,
    },
    location: { 
        type:String,
    },
    date: { 
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Item', itemSchema);
