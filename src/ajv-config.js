'use strict';

var Cache = require('./Cache'),
	Ajv = require('ajv'),
	_ = require('lodash'),
	sharedCache = new Cache(),
	ajv;

class ajvConfig {
	static set instance(opt) {
		if(ajv) 
			throw new Error('You are trying to overwrite ajv options!'); 
			
		opt = opt || {};

		_.defaults(opt, {
			cache: sharedCache
		});

		ajv = Ajv(opt)
	}
	
	static get instance() {
		return ajv;
	}
}

module.exports = ajvConfig;