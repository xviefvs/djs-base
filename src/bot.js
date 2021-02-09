require('dotenv/config')
const { Client, Collection, Permissions } = require('discord.js')
const { connect } = require('mongoose')
const ClientUtil = require('./utils/ClientUtil')
const Logger = require('./utils/Logger')
const Wrapper = require('./utils/DBWrapper')
const wrapper = require('./models/wrapper')
const settings = require('../settings')

class Bot extends Client {
	
	constructor() {
		super({
			disableMentions: 'everyone',
		})
		
		this.commands = new Collection()
		
		this.aliases = new Collection()
		
		this.cooldowns = new Collection()
		
		this.events = new Collection()
		
		this.utils = new ClientUtil(this)
		
		this.db = new Wrapper(this, wrapper)
		
		this.defaultPerms = new Permissions(['SEND_MESSAGES', 'VIEW_CHANNEL']).freeze()
		
		this.log = Logger
		
		this.settings = settings
		
	}
	
	getPrefix(message) {
		return this.db.get(message.guild.id, 'prefix', 'e.')
	}
	
	isOwner(id) {
		return settings.owners.includes(id)
	}
	
	connectDB() {
		return connect(process.env.mongo_uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			autoIndex: false
		})
	}
	
	build() {
		this.connectDB()
		this.db.init()
		this.utils.handleCommands()
		this.utils.handleEvents()
		super.login(process.env.bot_token)
	}
}

const bot = new Bot()
bot.build()
