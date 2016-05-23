'use strict';

/**TODO
 * - inline schema (without $rel) (by build) ??
 * - options edit by opt = super.options(); return opt; (works)
 * - getSkeleton, support for array:items ??
 */

var ajv = require('./ajv-config'),
	_ = require('lodash'),
	options = {
		backupsLevels: 1,
		ajv: {
			coerceTypes: true
		}
	};

class Model {
	constructor(data) {
		var opt = _.defaultsDeep(this.options(), this.constructor.options, options),
			schema = this.schema(),
			skeleton = opt.presets? getSkeleton(schema) : {},
			selfAjv;

		if(opt.ajv && !_.isPlainObject(opt.ajv)) {
			selfAjv = opt.ajv;
		} else {
			if(!ajv.instance)
				ajv.instance = options.ajv || {};

			selfAjv = ajv.instance;
		}

		Model.addSchema(schema);

		Object.defineProperties(this, {
			_id: {
				value: schema.title || schema.id
			},
			_backups: {
				value: []
			},
			_ajv: {
				get: function() {
					return selfAjv;
				}
			},
			_opt: {
				value: opt
			},
			_skeleton: {
				value: skeleton
			},
			errors: {
				value: null,
				writable: true
			}
		});

		if(opt.defaults) {
			_.merge(this, skeleton, this.defaults(), data || {});
		} else {
			_.merge(this, skeleton, data || {});
		}
	}
	
	options() {
		return {};
	}

	schema() {
		throw new Error('Extend schema methods with your own!');
	}

	defaults() {
		return {};
	}

	get $id() {
		return this._id;
	}

	$backup() {
		this._backups.unshift(_.cloneDeep(this));

		if(this._backups.length > this._opt.backupsLevels)
			this._backups.pop();
	}

	$validate() {
		var err = Model.validate(this.$id, this);
		this.errors = err;
		return err;
	}

	$validator(path) {
		var ajv = this._ajv,
			test = {},
			validator;

		test[path] = {
			$ref: this.$id+'#/properties/'+path
		};

		validator = this._ajv.compile(test);

		function validate() {
			return validator(this)? null : ajv.errors;
		}

		return validate;
	}

	$clone() {
		return new this.constructor(_.cloneDeep(this));
	}

	$toJSON() {
		return JSON.stringify(this);
	}

	$assign() {
		_.assign(this, ...arguments);
	}

	$merge() {
		_.merge(this, ...arguments);
	}

	$extend() {
		_.extend(this, ...arguments);
	}

	$defaults() {
		if(!arguments.length || arguments[0] === true) {
			_.defaults(this, this.defaults());
		} else {
			_.defaults(this, ...arguments);
		}
	}

	$omit(prop) {
		return _.omitBy(this, prop);
	}

	$pick(prop) {
		return _.pickBy(this, prop);
	}

	$has(arg) {
		return _.has(this, arg);
	}

	$clean() {
		for(var i in this) {
			delete this[i];
		}

		return this;
	}

	static cast(schema, data) {
		var errors = Model.validate(schema, data);

		var model = new this.constructor(data);
		model.errors = errors;
		return model;
	}

	static validate(schema, data) {
		var name = schema.title || schema.id || schema,
			cajv = ajv.instance,
			valid = cajv.validate(name, data);

		return valid? null : cajv.errors;
	}

	static addSchema(schema) {
		var name = schema.title || schema.id;

		if(name === undefined)
			throw new Error('Schema have not any title or id!');

		if(!ajv.instance.getSchema(name))
			ajv.instance.addSchema(schema, name);
	}

	static getSchema(name) {
		return ajv.instance.getSchema(name).schema;
	}

	static config(config) {
		if(!config || _.isPlainObject(config))
			return;

		if(options.changed)
			throw new Error('Reconfiguration try is not allowed!');

		if(config.ajv) {
			ajv.instance = config.ajv;
		}

		_.merge(options, config);
		options.changed = true;

		return options;
	}
}

function getSkeleton(schema) {
	var skeleton = {};

	itr(schema, skeleton);

	function itr(schema, obj) {
		var props = schema.properties;
		for(var i in props) {
			if(props[i].hasOwnProperty('properties')) {
				obj[i] = {};
				itr(props[i], obj[i]);
			} else if(props[i].type === 'array') {
				obj[i] = [];
			} else {
				obj[i] = undefined;
			}
		}
	}

	return skeleton;
}

module.exports = Model;