class Logger {
	
	upper(string) {
		return string.toUpperCase()
	}
	
	info(src, msg) {
		console.info(`\u001b[1m\u001b[33;1m[ ${this.current()} ] [ INFO ] [ ${this.upper(src)} ]: ${msg} `)
	}
	
	error(src, error) {
		console.error(`\u001b[1m\u001b[31;1m[ ${this.current()} ] [ ERROR ] [ ${this.upper(src)} ]: ${error}`)
	}
	
	debug(src, msg) {
		console.log(`\u001b[1m\u001b[36;1m[ ${this.current()} ] [ DEBUG ] [ ${this.upper(src)} ]: ${msg}`)
	}
	
	current() {
		return new Date().toLocaleTimeString()
	}
}

module.exports = new Logger();
