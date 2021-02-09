const { Permissions } = require('discord.js')

module.exports = class Command {
	
	constructor(client, name, options = {}) {
		
		this.client = client
		this.name = options.name || name
		this.aliases = options.aliases || []
		this.desc = options.desc || 'There is no description for this command.'
		this.usage = options.usage || 'There is no usage for this command.'
		this.example = options.example || []
		this.category = options.category || 'General'
		this.cooldown = Number(options.cooldown) || 3
		this.nsfw = Boolean(options.nsfw)
		this.ownerOnly = Boolean(options.ownerOnly) || false
		this.guildOnly = Boolean(options.guildOnly) || true
		this.userPerms = new Permissions(options.userPerms).freeze()
		this.botPerms = new Permissions(options.botPerms).freeze()
		this.args = Boolean(options.args) || false
	}
	
	async run(message, args) {
		return this.client.log.error('command', `Command ${this.name} doesn't have a default run method.`)
	}
}