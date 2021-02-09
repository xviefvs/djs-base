const Event = require('../../struct/Event')
const { connection } = require('mongoose')

module.exports = class OpenDB extends Event {
	
	constructor(...args) {
		super(...args, {
			once: true,
			emitter: connection
		})
	}
	
	run() {
		this.client.log.info('database', 'MongoDB connection successfully opened.')
	}
}