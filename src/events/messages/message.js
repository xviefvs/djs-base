const Event = require('../../struct/Event');
const { Collection } = require('discord.js');

module.exports = class MessageEvent extends Event {
	
	run(message) {
		if (!message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES'))
			return;

		const mentionRegex = new RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = new RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;

		const dataPrefix = this.client.getPrefix(message);

		if (message.content.match(mentionRegex))
			return message.channel.send(`My current prefix is \`${dataPrefix}\``);

		const prefix = message.content.match(mentionRegexPrefix)
			? message.content.match(mentionRegexPrefix)[0]
			: dataPrefix;

		if (!message.content.startsWith(prefix)) return;

		const [commandName, ...args] = message.content
			.slice(prefix.length)
			.toLowerCase()
			.trim()
			.split(/ +/g);

		const command =
			this.client.commands.get(commandName) ||
			this.client.commands.get(this.client.aliases.get(commandName));

		if (command) {
			if (command.ownerOnly && !this.client.isOwner(message.author.id)) {
				return;
			}

			if (command.guildOnly && !message.guild) {
				return message.reply(
					`${
						this.client.settings.emotes.warning
					} This command can only be run in a server.`
				);
			}

			if (command.nsfw && !message.channel.nsfw) {
				return message.channel.send(
					`${
						this.client.settings.emotes.warning
					} This command can only be run in a nsfw channel.`
				);
			}

			if (command.args && !args.length) {
				return message.channel.send(
					`${
						this.client.settings.emotes.warning
					} Invalid command usage please check out \`${prefix}help ${
						command.name
					}\` to use it correctly.`
				);
			}

			if (command.voice && !message.member.voice.channel) {
				return message.channel.send(
					`${
						this.client.settings.emotes.warning
					} You must be in a voice channel to use this command.`
				);
			}

			if (
				command.sameVoice &&
				message.member.voice.channel.id !== message.guild.me.voice.channel.id
			) {
				return message.channel.send(
					`${
						this.client.settings.emotes.warning
					} You need to be in the same voice channel as mine to use this command.`
				);
			}

			if (message.guild) {
				const userPermCheck = command.userPerms
					? this.client.defaultPerms.add(command.userPerms)
					: this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel
						.permissionsFor(message.member)
						.missing(userPermCheck);
					if (missing.length && !this.client.isOwner(message.author.id)) {
						return message.reply(
							`You are missing ${this.client.utils.formatArray(
								missing.map(this.client.utils.formatPerms)
							)} permissions, you need them to use this command!`
						);
					}
				}
				const botPermCheck = command.botPerms
					? this.client.defaultPerms.add(command.botPerms)
					: this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel
						.permissionsFor(this.client.user)
						.missing(botPermCheck);
					if (missing.length) {
						return message.reply(
							`I am missing ${this.client.utils.formatArray(
								missing.map(this.client.utils.formatPerms)
							)} permissions, I need them to run this command!`
						);
					}
				}
			}
			if (!this.client.cooldowns.has(command.name)) {
				this.client.cooldowns.set(command.name, new Collection());
			}

			if (!this.client.isOwner(message.author.id)) {
				const now = Date.now();
				const timestamps = this.client.cooldowns.get(command.name);
				const cooldownAmount = command.cooldown * 1000;
				if (timestamps.has(message.author.id)) {
					const expirationTime =
						timestamps.get(message.author.id) + cooldownAmount;
					if (now < expirationTime) {
						const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
						return message.channel.send(
							`Please wait ${timeLeft} more second(s) before reusing the \`${
								command.name
							}\` command.`
						);
					}
				}
				timestamps.set(message.author.id, now);
				setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
			}
			
			try {
				command.run(message, args);
			} catch (err) {
				this.client.log.error(`${command.name}`, err);
				return message.channel.send(
					`> ${
						this.client.settings.emotes.warning
					} There was an error while executing this command: \`${err.message}\``
				);
			}
		}
	}
};
