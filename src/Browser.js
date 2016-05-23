'use strict';

var Basic = require('./Basic'),
	xhr = require('./xhr'),
	_ = require('lodash'),
	utils = require('./utils'),
	options = {};

//TODO upload

class RESTModel extends Basic {
	constructor(data) {
		super(data);

		var schema = this.schema(),
			url = utils.urlFormatter(schema.url),
			baseUrl = schema.basicUrl? utils.baseUrlFormatter(schema.basicUrl) : undefined;

		Object.defineProperties(this, {
			_url: {
				value: url
			},
			_basicUrl: {
				value: baseUrl
			}
		});
	}

	get $url() {
		return this._url;
	}
	
	get basicUrl() {
		return this._basicUrl;
	}

	$post(subpath, opt) {
		if(_.isString(subpath)) {
			opt = opt || {};
		} else {
			opt = subpath || {};
			subpath = '';
		}

		opt.path = subpath;
		opt.method = 'POST';

		return this.$xhr(opt);
	}

	$delete(subpath, opt) {
		if(_.isString(subpath)) {
			opt = opt || {};
		} else {
			opt = subpath || {};
			subpath = '';
		}

		opt.path = subpath;
		opt.method = 'DELETE';

		return this.$xhr(opt);
	}

	$get(subpath, opt) {
		if(_.isString(subpath)) {
			opt = opt || {};
		} else {
			opt = subpath || {};
			subpath = '';
		}

		opt.path = subpath;
		opt.method = 'GET';

		return this.$xhr(opt);
	}

	$put(subpath, opt) {
		if(_.isString(subpath)) {
			opt = opt || {};
		} else {
			opt = subpath || {};
			subpath = '';
		}

		opt.path = subpath;
		opt.method = 'PUT';

		return this.$xhr(opt);
	}

	$head(subpath, opt) {
		if(_.isString(subpath)) {
			opt = opt || {};
		} else {
			opt = subpath || {};
			subpath = '';
		}

		opt.path = subpath;
		opt.method = 'HEAD';

		return this.$xhr(opt);
	}

	/*
	$upload(subpath, upload, opt) {
		opt.method = 'POST';

		var form = new FormData();

		for(var i in this) {
			form.append(i, this[i]);
		}

		for(var j in upload) {
			if(_.isArray(upload[j])) {
				upload[j].forEach(function(element) {
					form.append(j, element);
				});
			} else {
				form.append(j, upload[j]);
			}
		}

		delete opt.headers['Content-Type'];
		opt.data = form;

		return this.$xhr(subpath, opt);
	}*/

	$xhr(opt) {
		opt = opt || {};

		var subpath = opt.path || '',
			method = opt.method || 'GET',
			hasData = method === 'POST' || method === 'PUT',
			params = this._opt.params || null,
			used = [],
			cut;

		if(subpath.length)
			subpath = utils.urlFormatter(subpath);
		
		var url = (this.$url+subpath).replace(/:[^\/]+/g, (match, index)=>{
			if(cut !== undefined)
				return '';

			var key = match.slice(1),
				ret;

			if(params && params[key]) {
				ret = params[key](this[key], true, key, this);
			} else if(this.hasOwnProperty(key)) {
				ret = this[key];
			}

			if(!ret) {
				cut = index;
				return '';
			} else if(!opt.pickParams) {
				used.push(key);
			}

			return ret;
		});

		if(cut)
			url = url.slice(0, cut-1);

		if(this.basicUrl)
			url = this.basicUrl + url;

		var req = _.defaults(opt || {}, {
			data: hasData? JSON.stringify(_.omit(this, used)) : null,
			method,
			url
		});

		var headers = {
			'content-type': 'application/json; charset=UTF-8'
		};

		req.headers = _.reduce(req.headers || {}, function(ret, value, key) {
			ret[key.toLowerCase()] = value;
			return ret;
		}, headers);

		return xhr(req);
	}

	static xhr(req) {
		return xhr(req);
	}
}

RESTModel.options = options;

module.exports = RESTModel;