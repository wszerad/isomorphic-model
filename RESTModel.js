module.exports = (function() {
	var isBrowser = (typeof self == 'object' && self.self === self),
		backend = './src//Backend';
	
	return isBrowser? require('./src/Browser') : require(backend);
})();
