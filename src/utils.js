module.exports = {
	baseUrlFormatter: function(baseUrl) {
		if(baseUrl[baseUrl.length-1] === '/')
			baseUrl = baseUrl.slice(0, -1);
		
		return baseUrl;
	},
	urlFormatter: function(url) {
		if(url[url.length-1] === '/')
			url = url.slice(0, -1);
		if(url[0] !== '/')
			url = '/'+url;
		
		return url;
	}
};