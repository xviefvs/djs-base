module.exports = class Event {
	
	constructor(client, name, options = {}) {
		this.client = client
		this.name = options.name || name
		this.type = options.once ? 'once' : 'on'
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client
	}
	
	async run(...args) {
		return this.client.log.error('event', `Event ${this.name} doesn't have a default run method.`)
	}
}