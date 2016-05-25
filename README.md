#How to use:

## Shared (shared.js)
```js
var Model = require('isomorphic-model/RESTModel');
//You can also call require('isomorphic-model/Model') for model without rest methods

class Basic extends Model {
	schema() {
		return {
			id: 'one',
			baseUrl: '127.0.0.1:3000',
			url: 'api',
			type: 'object',
			properties: {
				title: {
					type: 'string',
				},
				created: {
					type: 'date'
				}
			}
		};
	}
	
	defaults() {
		return {
			created: new Date()
		};
	}
}
```

## Front
```js
var Basic = require('./shared.js');

class BasicExt extends Basic {
	schema() {
		var schema = super.schema();
		schema.properties.created.required = true;
		
		return schema; 
	}
	
	customMethod() {
		console.log(this.created);
	}
	
	options() {
		return {
			defaults: true
		};
	}
}

var model = new BasicExt({
	login: 'john32'
});

model.$get('/login/check').then()


```
## Backend
```js

```

# new Model(data)

## methods

### options

 Should return flatt object with options.

### schema

 Should return JSONSchema data model.

### defaults

 Model to set when $default() used.

### get $id

 Getter, return schema.id || schema.title

### $backup

 Save to backup actual model

### $restore([num])

 Restore model from backup, default last one saved(index = 0). You can use negative numbers to get last one(index = -1) 

### $validate

 Validate model with rules from schema. 
 Return null for valid and ajv.errors if invalid;

### $validator(path)

 Compile validator for property from path. Use JSONSchema $ref pattern (prefix #/proprieties/ is added). So 'one' refers to #/proprieties/one.

### $defaults([...defaults])
 
 Pass true or null to use lodash.defaults with data from Model.defaults()
 Otherwise work like lodash.defaults(...defaults)
 
### $clean
 
 Delete all properties from model
 
### $toJSON
 
 Return JSON.stringify(this)

### $clone

 lodash deepClone, return new instance of Model

### $assign 

 lodash assign where first argument is this (model)
 
### $merge

 lodash merge where first argument is this (model)

### $extend

 lodash extend where first argument is this (model)
 
### $omit

 lodash omit where first argument is this (model)
 
### $pick

 lodash pick where first argument is this (model)
 
### $has

 lodash has where first argument is this (model)

## static

### validate(schema || name, data)

 Access to global ajv.validate

### addSchema(schema)

 Access to global ajv.addSchema

### getSchema(name)

 Access to global ajv.getSchema

### config(config)

 Set global options for all models. Can be use once before any model initialization or ajv.validation
 
# RESTModel (for browser)

## methods

### get $url

 Getter, return schema.url;

### get basicUrl

 Getter, return schema.basicUrl;

### ($get|$post|$head|$delete|$put)(path[, opt])

 Call $xhr (see below, about opt also) with opt.method set to request type and opt.path set to path argument.

### $xhr(opt)

 CAll xhr xhr lib with options

```js
//defaults:
 {
    method: 'GET',
    path: '',   //url is created with this.$baseUrl + this.$url + path
    data: this,   //object with data, for example model
    pickParams: false   //if params user in path or this.$url, should be also send with data
 }
```
## static

### xhr(opt)

 Native call of xhr lib

# RESTModel (for node.js & express)

## methods

### get $url

 Getter, return schema.url;

## static

### handle(parentRouter)

 parentRouter - express() or express().Route()
 
 return router.use(this.$url) with added middleware
 