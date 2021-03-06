## Installation
1. Clone the bot base, in terminal type `git clone https://github.com/xviefvs/djs-base` (need to have git installed).
2. In terminal type `cd djs-base`.
3. After that type `npm i` or `yarn`
4. Open the the project with a code editor (Visual Studio Code Recommended).
5. In `.env` fill all the required value
6. Start the bot. (In terminal type `npm start` or `yarn start`)

### .env
`bot_token`: Go [Here](https://discord.com/developers/applications) 


`mongo_uri`: Go [Here](https://www.mongodb.com/cloud/atlas)

### A command example
```js
const Command = require('../../struct/Command');

module.exports = class extends Command {
	
	constructor(...args) {
		super(...args, {
			name: 'ban',
			desc: 'Ban a member',
			usage: '[member]',
			example: ['@tomc#7817'],
			category: 'Moderation',
			guildOnly: true,
			ownerOnly: false,
			userPerms: ['BAN_MEMBER'],
			botPerms: ['BAN_MEMBER'],
			nsfw: false,
			args: true,
			voice: false,
			sameVoice: false
		})
	}
	
	run(message, args) {
		// Your code here
	}
}
```

### Event example 
```js
const Event = require('../../struct/Event')

module.exports = class extends Event {
	
	constructor(...args) {
		super(...args, {
			name: 'message',
		})
	}
	
	run(message) {
		// Your code here
	}
}
```

### How to use db wrapper.
```js
this.client.db.getDocument(guildId: string)
```
Return all the data for the guild

```js
this.client.db.set(guildId: string, key: string, value: any)
```
Use this like quick.db

```js
this.client.db.get(guildId: string, key: string, defaultValue: any)
```
If the data doesn't exist it will return the default value instead.

```js
this.client.db.delete(guildId: string, key: string)
```
Delete data from a key you provided

```js
this.client.db.clear(guildId: string)
```
Delete all the data from a guild
