const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    dimension: {
        type: String,
        required: true
    },
 
    residents: [
		{
			resident: {
				type: Schema.Types.ObjectId,
				ref: 'character'
			}
		}
	],


});

module.exports = Location = mongoose.model('location', LocationSchema);
