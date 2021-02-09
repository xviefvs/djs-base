const { Schema, model } = require('mongoose')

const WrapperSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	wrapper: {
		type: Object,
		require: true
	}
}, { minimize: false })

module.exports = model('wrapper', WrapperSchema)
