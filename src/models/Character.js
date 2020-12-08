const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	species: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		required: true
	},
	origin: {
		type: Schema.Types.ObjectId,
		ref: 'location'
	},

	location: {
		type: Schema.Types.ObjectId,
		ref: 'location'
	},
	image: {
		type: String,
		required: true
	},

	episodes: [
		{
			episode: {
				type: Schema.Types.ObjectId,
				ref: 'episode'
			}
		}
	]


});

module.exports = Character = mongoose.model('character', CharacterSchema);
