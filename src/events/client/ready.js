const Event = require('../../struct/Event')

module.exports = class ReadyEvent extends Event {
	
	constructor(...args) {
		super(...args, {
			once: true
		})
	}
	
	run() {
		this.client.log.info('client', `Logged in as ${this.client.user.tag}`)
		this.client.log.info('command', `Loaded ${this.client.commands.size} commands`)
		this.client.log.info('event', `Loaded ${this.client.events.size} events`)
	}
}
