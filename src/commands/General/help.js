const Command = require('../../struct/Command')

module.exports = class HelpCommand extends Command {
	
	constructor(...args) {
		super(...args, {
			description: 'Get all the available commands.',
			usage: '[command]',
			example: ['ping']
		})
	}
	
	run(message, [command]) {
		const prefix = this.client.getPrefix(message)
		
		const embed = this.client.utils.embed()
		.setColor(this.client.settings.embed_main)
		.setAuthor(`${message.guild.name} Help`, message.guild.iconURL({ dynamic: true }))
		.setTimestamp()
		
		if (command) {
			const cmd = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd))
			
			if (!cmd) return message.channel.send('Invalid command.')
			
			embed.setAuthor('Everything in `<>` is required, `[]` is a optional parameter', message.author.displayAvatarURL({ dynamic: true }))
			embed.setTitle(`\`${prefix}\`${cmd.name}\` \`${cmd.usage ? cmd.usage : ''}\``)
			embed.addField('Usage', cmd.usage ? '`' + prefix + cmd.name + cmd.usage + '`' : 'No usage')
			embed.addField('Example', cmd.example.length ? cmd.example.map(m => `\`${prefix}${cmd.name} ${m}\``) : 'No example')
			
			return message.channel.send(embed)
		}
		else {
			embed.setDescription('For additional info about a command use ' + `\`${prefix}help [command]\``)
			
			let categories
			if (!this.client.isOwner(message.author.id)) {
				categories = this.client.utils.removeDupes(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category))
			}
			else {
				categories = this.client.utils.removeDupes(this.client.commands.map(cmd => cmd.category))
			}
			
			for (const category of categories) {
			
				embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '))
			}
			
			return message.channel.send(embed)
		}
	}
}
