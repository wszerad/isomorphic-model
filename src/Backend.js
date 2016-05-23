'use strict';

var Basic = require('./Basic'),
	utils = require('./utils'),
	express = require('express'),
	options = {};

class RESTModel extends Basic {
	constructor(data) {
		super(data);

		var schema = this.schema(),
			url = utils.urlFormatter(schema.url);
	
		Object.defineProperties(this, {
			_url: {
				value: url
			}
		});
	}

	get $url() {
		return this._url;
	}

	static $handle(parentRouter) {
		var router = express.Router();
		parentRouter.use(utils.urlFormatter(this.prototype.schema().url), middleware(this), router);

		return router;
	}
}

RESTModel.options = options;

function middleware(Model) {
	return function(req, res, next) {
		var model = req.model = new Model();
		for(var i in req.params) {
			model[i] = req.params[i];
		}

		for(var j in req.body) {
			model[j] = req.body[j];
		}
		
		req.errors = model.$validate();
		next();
	}
}

module.exports = RESTModel;