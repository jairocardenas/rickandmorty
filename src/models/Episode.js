const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EpisodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  air_date: {
    type: String,
    required: true
  },

  episode: {
    type: String,
    required: true
  },

   characters: [
		{
			character: {
				type: Schema.Types.ObjectId,
				ref: 'character'
			}
		}
	],


});


module.exports = Episode = mongoose.model('episode', EpisodeSchema);
