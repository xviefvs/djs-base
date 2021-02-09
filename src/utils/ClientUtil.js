const path = require('path')
const { promisify } = require('util')
const glob = promisify(require('glob'))
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Command = require('../struct/Command')
const Event = require('../struct/Event')

module.exports = class ClientUtil {
	
	constructor(client) {
		this.client = client
	}
	
	isClass(input) {
		return typeof input && 'function' && typeof input.prototype === 'object' && input.toString().substring(0, 5) === 'class'
	}
	
	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`
	}
	
	removeDupes(array) {
		return [...new Set(array)]
	}
	
	capitalise(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}
	
	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position
	}
	
	formatPerms(perms) {
		return perms
		.toLowerCase() 				
		.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
		.replace(/_/g, ' ') 
		.replace(/Guild/g, 'Server')
		.replace(/Use Vad/g, 'Use Voice Acitvity')
	}
	
	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', {
			style: 'short',
			type
		}).format(array)
	}
	
	async handleCommands() {
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile]
				const { name } = path.parse(commandFile)
				const File = require(commandFile)
				if (!this.isClass(File)) return this.client.log.error('command', `Command ${name} doesn't export a class.`)
				const command = new File(this.client, name.toLowerCase())
				if (!command instanceof Command) return this.client.log.error('command', `${name} doesn't belong in commands folder.`)
				this.client.commands.set(command.name, command)
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name)
					}
				}
			}
		})
	}
	
	async handleEvents() {
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile]
				const { name } = path.parse(eventFile)
				const File = require(eventFile)
				if (!this.isClass(File)) return this.client.log.error('event', `Event ${name} dorsn't export a class.`)
				const event = new File(this.client, name.toLowerCase())
				if (!(event instanceof Event)) return this.client.log.error('event', `${name} doesn't belong in events folder.`)
				this.client.events.set(event.name, event)
				event.emitter[event.type](name, (...args) => event.run(...args))
			}
		})
	}
	
	embed() {
		return new MessageEmbed()
	}
	
	attachment(buffer, name) {
		return new MessageAttachment(buffer, name ? name : '')
	}
}