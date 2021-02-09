const { Collection } = require('discord.js');

module.exports = class Wrapper {
	constructor(client, model) {
		this.client = client;
		this.model = model;
		this.items = new Collection();
	}

	async init() {
		const guilds = await this.model.find;

		for (const i in guilds) {
			const guild = guilds[i];
			this.items.set(guild.id, guild.wrapper);
		}
	}

	get(id, key, defaultValue) {
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value == null ? defaultValue : value;
		}

		return defaultValue;
	}

	async set(id, key, value) {
		const data = this.items.get(id);
		data[key] = value;
		this.items.set(id, data);

		const doc = await this.getDocument(id);
		doc.wrapper[key] = value;
		doc.markModifed('wrapper');
		return doc.save();
	}

	async delete(id, key) {
		const data = this.items.get(id) || {};
		delete data[key];
		const doc = await this.getDocument(id);
		delete doc.wrapper[key];
		doc.markModified('wrapper');
		return doc.save();
	}

	async clear(id) {
		this.items.delete(id);
		const doc = await this.getDocument(id);
		if (doc) await doc.remove();
	}

	async getDocument(id) {
		const obj = await this.model.findOne({ id });
		if (!obj) {
			const newDoc = await new this.model({ id, settings: {} }).save();
			return newDoc;
		}
		return obj;
	}
};
